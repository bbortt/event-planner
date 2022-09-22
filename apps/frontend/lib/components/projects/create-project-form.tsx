import { Form } from 'react-bootstrap';

import { Field, Formik } from 'formik';

import { Project } from 'lib/models';

type FormErrorsType = {
  name?: string;
  description?: string;
  startDate?: string;
};

type CreateProjectFormProps = {
  initialProject?: Project;
  setIsValid: (isValid: boolean) => void;
  setProject: (project: Project) => void;
};

const CreateProjectForm = ({ initialProject, setIsValid, setProject }: CreateProjectFormProps) => {
  const validateForm = (values: Project) => {
    const errors: FormErrorsType = {};

    if (values.name && values.name.length > 50) {
      errors.name = 'Es Projekt muess ä Namä ha u dä darf maximal 50 Zeichä läng si.';
    }
    if (values.description && values.description.length > 300) {
      errors.description = 'Es Beschribig darf maximal 300 Zeichä läng si.';
    }
    if (values.startDate && values.startDate < new Date()) {
      errors.startDate = 'Es Projekt muess es Startdatum ir Zuekunft ha.';
    }
    if (values.endDate && values.endDate < new Date()) {
      errors.startDate = 'Es Projekt muess es Ändatum ir Zuekunft ha.';
    }
    if (values.endDate && values.startDate && values.endDate < values.startDate) {
      errors.startDate = 'Ds Ändatum cha ned vorem Startdatum liggä.';
    }

    const isValid = !!values.name && !!values.startDate && !!values.endDate && !errors;
    if (isValid) {
      setProject({ ...values });
    }

    setIsValid(isValid);
    return errors;
  };

  const shallDisplayError = (show: boolean) => ({ visibility: show ? 'inherit' : 'hidden' });

  return (
    <Formik initialValues={initialProject ? initialProject : { startDate: new Date(), endDate: new Date() }} validate={validateForm}>
      {({ values, touched, isValid, errors }) => (
        <Form noValidate>
          <Field name="name">
            {({ field, form: { touched, errors } }) => (
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Namä</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Namä fürs Projekt"
                  {...field}
                  isValid={touched.name && !errors.name}
                  isInvalid={touched.name && errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            )}
          </Field>
          <Field name="description">
            {({ field, form: { errors } }) => (
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Beschribig</Form.Label>
                <Form.Control
                  required
                  type="text"
                  as="textarea"
                  placeholder="Ä optionali Beschribig"
                  {...field}
                  isValid={touched.description && !errors.description}
                  isInvalid={touched.description && errors.description}
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              </Form.Group>
            )}
          </Field>
          <Field name="startDate">
            {({ field, form: { errors } }) => (
              <Form.Group className="mb-3" controlId="startDate">
                <Form.Label>Start Datum</Form.Label>
                <Form.Control
                  required
                  type="date"
                  {...field}
                  isValid={touched.startDate && !errors.startDate}
                  isInvalid={touched.startDate && errors.startDate}
                />
                <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
              </Form.Group>
            )}
          </Field>
          <Field name="endDate">
            {({ field, form: { errors } }) => (
              <Form.Group className="mb-3" controlId="endDate">
                <Form.Label>Start Datum</Form.Label>
                <Form.Control
                  required
                  type="date"
                  {...field}
                  isValid={touched.endDate && !errors.endDate}
                  isInvalid={touched.endDate && errors.endDate}
                />
                <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
              </Form.Group>
            )}
          </Field>
        </Form>
      )}
    </Formik>
  );
};

export default CreateProjectForm;
// description?: string;
// /**
//  *
//  * @type {Date}
//  * @memberof Project
//  */
// startDate: Date;
// /**
//  *
//  * @type {Date}
//  * @memberof Project
//  */
// endDate: Date;
