import avatar1 from '@/assets/images/users/avatar-1.jpg';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const OwnerDetails = ({ property, landlordName }) => {
  const messageSchema = yup.object({
    date:        yup.string().required('Please enter date'),
    time:        yup.string().required('Please enter time'),
    name:        yup.string().required('Please enter your name'),
    email:       yup.string().email().required('Please enter email'),
    number:      yup.string().required('Please enter number'),
    description: yup.string().required('Please enter description'),
  });

  const { handleSubmit, control } = useForm({ resolver: yupResolver(messageSchema) });

  // Landlord name: prefer resolved name from /lead/get_all/, fallback to createdBy
  const ownerName =
    landlordName ||
    property?.propertyDetails?.landlord_name ||
    property?.propertyDetails?.landlordName  ||
    property?.createdBy?.name ||
    'Property Owner';

  return (
    <Col xl={3} lg={4}>
      <Card>
        <CardHeader className="bg-light-subtle">
          <CardTitle as="h4">Property Owner Details</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-center">
            <img
              src={avatar1}
              alt="avatar"
              className="avatar-xl rounded-circle border border-2 border-light mx-auto"
            />
            <div className="mt-2">
              <Link to="" className="fw-medium text-dark fs-16">{ownerName}</Link>
              <p className="mb-0 text-muted">(Owner)</p>
            </div>
            <div className="mt-3">
              <ul className="list-inline justify-content-center d-flex gap-1 mb-0 align-items-center">
                {[
                  { icon: 'ri:facebook-fill',  cls: 'text-primary' },
                  { icon: 'ri:instagram-fill', cls: 'text-danger'  },
                  { icon: 'ri:twitter-fill',   cls: 'text-info'    },
                  { icon: 'ri:whatsapp-fill',  cls: 'text-success' },
                ].map(({ icon, cls }) => (
                  <li key={icon} className="list-inline-item">
                    <Button variant="light" className={`d-flex avatar-sm align-items-center justify-content-center ${cls} fs-20`}>
                      <IconifyIcon width={20} height={20} icon={icon} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardBody>
        <CardFooter className="bg-light-subtle">
          <Row className="g-2">
            <Col lg={6}>
              <Button variant="primary" className="w-100">
                <IconifyIcon icon="solar:phone-calling-bold-duotone" className="align-middle fs-18" /> Call Us
              </Button>
            </Col>
            <Col lg={6}>
              <Button variant="success" className="w-100">
                <IconifyIcon icon="solar:chat-round-dots-bold-duotone" className="align-middle fs-16" /> Message
              </Button>
            </Col>
          </Row>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="bg-light-subtle">
          <CardTitle as="h4">Schedule A Tour</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(() => {})}>
          <CardBody>
            <div className="mb-3"><TextFormInput control={control} name="date"        placeholder="dd-mm-yyyy"    /></div>
            <div className="mb-3"><TextFormInput control={control} name="time"        placeholder="12:00 PM"      /></div>
            <div className="mb-3"><TextFormInput control={control} name="name"        placeholder="Your Full Name"/></div>
            <div className="mb-3"><TextFormInput control={control} name="email"       placeholder="Email"         /></div>
            <div className="mb-3"><TextFormInput control={control} name="number"      placeholder="Number"        /></div>
            <div>
              <TextAreaFormInput
                control={control}
                name="description"
                className="form-control"
                id="schedule-textarea"
                rows={5}
                placeholder="Message"
              />
            </div>
          </CardBody>
          <CardFooter className="bg-light-subtle">
            <Button variant="primary" className="w-100" type="submit">Send Information</Button>
          </CardFooter>
        </form>
      </Card>
    </Col>
  );
};

export default OwnerDetails;