import React from 'react'
import { Button, Row, Col } from 'antd'
import { Formik, Form, Field, FieldArray } from 'formik'
import _ from 'lodash'

const alignedRow = (left, right, key = '') => (
  <Row className="MB-4 MT-6" key={key}>
    <Col span={20}>{left}</Col>
    <Col span={4}>{right}</Col>
  </Row>
)

const valuesToMarkdown = values => `${_.map(values, (list, field) => `## ${_.upperFirst(field)}\n${list.map(text => `* ${text}`).join('\n')}`).join('\n')}\n---`

export default ({ roomId, channel }) => {
  return (
    <Formik
      initialValues={{ past: ['a', 'b'], plan: [], proposal: [] }}
      validate={values => {
        const errors = {}
        if (!values.past) {
          errors.past = 'Required'
        }
        if (!values.plan) {
          errors.plan = 'Required'
        }
        if (!values.proposal) {
          errors.proposal = 'Required'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        const text = valuesToMarkdown(values)
        channel.load('add_message', { room_id: roomId, text })
        setSubmitting(false)
      }}
    >
      {({ isSubmitting, values }) => (
        <Form>
          {['past', 'plan', 'proposal'].map(field => (
            <div key={field}>
              <h2>{_.upperFirst(field)}</h2>
              <FieldArray
                name={field}
                render={arrayHelpers => (
                  <div className="ML-6">
                    {values[field].map((text, index) =>
                      alignedRow(
                        <Field name={`${field}[${index}]`} />,
                        <Button type="secondary" shape="circle" icon="minus" className="F-R" onClick={() => arrayHelpers.remove(index)} />,
                        index
                      )
                    )}
                    <Button type="primary" shape="circle" icon="plus" onClick={() => arrayHelpers.push('')} />
                  </div>
                )}
              />
            </div>
          ))}
          <div className="TA-C">
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
