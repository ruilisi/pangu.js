import React from 'react'
import { Button, Row, Col } from 'antd'
import { Formik, Form, Field, FieldArray } from 'formik'
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import { viewSetIn } from '../redux/modules/view'

const alignedRow = (left, right, key = '') => (
  <Row className="MB-4 MT-6" key={key}>
    <Col span={20}>{left}</Col>
    <Col span={4}>{right}</Col>
  </Row>
)

const valuesToMarkdown = values => `${_.map(values, (list, field) => `## ${_.upperFirst(field)}\n${list.map(text => `* ${text}`).join('\n')}`).join('\n')}\n---`

export default ({ roomId, subscription }) => {
  console.info(subscription, roomId)
  const dp = useDispatch()
  return (
    <Formik
      initialValues={{ past: [], plan: [], proposal: [] }}
      onSubmit={(values, { setSubmitting }) => {
        const text = valuesToMarkdown(values)
        subscription.perform('load', { path: 'add_message', data: { room_id: roomId, text } })
        dp(viewSetIn(['game', 'show'], false))
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
