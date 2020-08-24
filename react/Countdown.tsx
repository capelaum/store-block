import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'
import { useCssHandles } from "vtex.css-handles"

import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './queries/productReleaseDate.graphql'

const CSS_HANDLES = ["countdown"]
const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()

interface CountdownProps { 
  targetDate: string
}

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ targetDate = DEFAULT_TARGET_DATE }) => {

  const [timeRemaining, setTime] = useState<TimeSplit>({ 
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct()

  if (typeof product === "undefined") {
    tick(targetDate, setTime)
  } else {
    const { product: { linkText } } = useProduct()
    const { data, loading, error } = useQuery(productReleaseDate, {
      variables: {
        slug: linkText
      },
      ssr: false
    })
    if (loading) {
      return (
        <div>
          <span>Loading...</span>
        </div>
      )
    }
    if (error) {
      return (
        <div>
          <span>Erro!</span>
        </div>
      )
    }
    if (!product) {
      return (
        <div>
          <span>Não há contexto de produto</span>
        </div>
      )
    }
    tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)
  }
  return (
    <div>
      <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
        {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
      </div>
    </div>
  )
}  

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Final date',
      description: 'Final date used in the countdown',
      type: 'string',
      default: null
    },
  },
}

export default Countdown
