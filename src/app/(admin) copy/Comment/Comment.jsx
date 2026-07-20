import PageTitle from '@/components/PageTitle';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { Card, CardBody, Col, Row, Spinner, Badge, Alert, Button } from 'react-bootstrap'; 
import avatar1 from '@/assets/images/users/avatar-1.jpg';

const CenteredTimeline = ({ comments }) => {
  // Group comments by date
  const groupedComments = comments.reduce((acc, comment) => {
    const date = new Date(comment.createdAt);
    const dateKey = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(comment);
    return acc;
  }, {});

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="timeline">
      {Object.keys(groupedComments).map((day, dayIdx) => (
        <div key={dayIdx}>
          <article className="timeline-time">
            <div className="time-show d-flex align-items-center justify-content-center mt-0">
              <h5 className="mb-0 text-uppercase fs-14 fw-semibold">{day}</h5>
            </div>
          </article>
          
          {groupedComments[day].map((comment, idx) => (
            <article 
              className={idx % 2 === 0 ? "timeline-item timeline-item-left" : "timeline-item"} 
              key={comment.commentId}
            >
              <div className="timeline-desk">
                <div className="timeline-box clearfix">
                  <span className="timeline-icon" />
                  <div className="overflow-hidden">
                    <Card className="d-inline-block">
                      <CardBody>
                        <div className="d-flex align-items-start gap-2 mb-2">
                          <img
                            src={avatar1}
                            alt="user"
                            width="32"
                            height="32"
                            className="rounded-circle"
                            style={{ border: '2px solid #e0e0e0', flexShrink: 0 }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <h6 className="mb-0 fs-14 fw-semibold">
                                {comment.createdBy?.name || 'Unknown'}
                              </h6>
                              <small className="text-muted">{formatTime(comment.createdAt)}</small>
                            </div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <Badge bg="info" className="fs-11">
                                {comment.createdBy?.department || 'N/A'}
                              </Badge>
                              <Badge bg={comment.targetType === 'landlord' ? 'warning' : 'success'} className="fs-11">
                                {comment.targetType || 'N/A'}
                              </Badge>
                              {comment.createdBy?.phoneNumber && (
                                <small className="text-muted fs-11">
                                  {comment.createdBy.phoneNumber}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted mb-2">{comment.content}</p>
                        
                        {/* Display replies if any */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ms-4 mt-3 border-start ps-3">
                            {comment.replies.map((reply, replyIdx) => (
                              <div key={replyIdx} className="mb-2">
                                <div className="d-flex align-items-start gap-2">
                                  <img
                                    src={avatar1}
                                    alt="user"
                                    width="24"
                                    height="24"
                                    className="rounded-circle"
                                    style={{ border: '1px solid #e0e0e0', flexShrink: 0 }}
                                  />
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <small className="fw-semibold">
                                        {reply.createdBy?.name || 'Unknown'}
                                      </small>
                                      <small className="text-muted fs-11">
                                        {formatTime(reply.createdAt)}
                                      </small>
                                    </div>
                                    <p className="mb-0 text-muted fs-13">{reply.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ))}
    </div>
  );
};

const Timeline = () => {
  const location = useLocation();
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Get leadId and targetType from location state
  const leadId = location.state?.leadId || location.state?.lead?.leadId || location.state?.lead?.lead_id;
  const targetType = location.state?.targetType || 'tenant';

  const handleBack = () => {
    navigate(-1);
  };

  const fetchComments = useCallback(async () => {
    if (!leadId) {
      setError('No lead ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Build URL with proper query parameters
      const params = new URLSearchParams();
      params.append('target_id', String(leadId));
      params.append('target_type', targetType);
      params.append('page_num', String(currentPage));
      params.append('limit', '20');
      
      const url = `${API_BASE_URL}/marketing/comment/get_all/?${params.toString()}`;
      
      console.log('Fetching comments for:');
      console.log('- Lead ID:', leadId);
      console.log('- Target Type:', targetType);
      console.log('- API URL:', url);
      console.log('- AUTH_TOKEN:', AUTH_TOKEN ? 'Present' : 'Missing');
      
      const response = await httpClient.get(url, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);

      if (response.data?.status && response.data?.data) {
        const fetchedComments = response.data.data.data || [];
        
        console.log('Total comments fetched:', fetchedComments.length);
        
        setComments(fetchedComments);
        setTotalPages(response.data.data.totalPage || 0);
      } else {
        setComments([]);
        setTotalPages(0);
      }
    } catch (e) {
      console.error('Error fetching comments:', e);
      console.error('Error response:', e?.response?.data);
      
      let errorMessage = 'Failed to load comments';
      
      if (e?.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (e?.response?.status === 422) {
        errorMessage = 'Invalid request parameters. Please check lead ID and target type.';
      } else if (e?.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e?.message) {
        errorMessage = e.message;
      }
      
      setError(errorMessage);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [leadId, targetType, currentPage]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <>
      <PageTitle title="Comments & Log History" subName="Pages" />
      <Button 
            variant="light" 
            className="fw-medium mb-3" 
            onClick={handleBack}
        >
           ← Back
        </Button>
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody>
              {/* Show Lead ID and Type info */}
              {leadId && (
                <Alert variant="info" className="mb-3 d-flex align-items-center justify-content-between">
                  <div>
                    <small>
                      Showing comments for Lead ID: <strong>{leadId}</strong>
                    </small>
                  </div>
                  <Badge bg={targetType === 'landlord' ? 'warning' : 'success'}>
                    {targetType.toUpperCase()}
                  </Badge>
                </Alert>
              )}
              
              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : error ? (
                <Alert variant="danger" className="text-center">
                  <strong>Error:</strong> {error}
                </Alert>
              ) : comments.length === 0 ? (
                <Alert variant="warning" className="text-center">
                  No comments found for this {targetType} (ID: {leadId}).
                </Alert>
              ) : (
                <>
                  <CenteredTimeline comments={comments} />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="mt-4">
                      <ul className="pagination justify-content-center mb-0">
                        <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                          >
                            <button
                              type="button"
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Timeline;