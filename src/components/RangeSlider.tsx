"use client"

import { useState, useEffect } from "react"

interface RangeSliderProps {
  minValue: number
  maxValue: number
  currentMin: number
  currentMax: number
  onChange: (min: number, max: number) => void
  formatValue?: (value: number) => string
  label?: string
  step?: number
  disabled?: boolean
}

export default function RangeSlider({
  minValue,
  maxValue,
  currentMin,
  currentMax,
  onChange,
  formatValue,
  label = "Range",
  step = 1,
  disabled = false,
}: RangeSliderProps) {
  const [minVal, setMinVal] = useState(currentMin)
  const [maxVal, setMaxVal] = useState(currentMax)

  // Atualizar valores internos quando as props mudarem
  useEffect(() => {
    // Garantir que os valores estejam dentro dos limites
    const clampedMin = Math.max(currentMin, minValue)
    const clampedMax = Math.min(currentMax, maxValue)
    setMinVal(clampedMin)
    setMaxVal(clampedMax)
  }, [currentMin, currentMax, minValue, maxValue])

  // Debug log
  useEffect(() => {
    console.log('RangeSlider props:', {
      minValue,
      maxValue,
      currentMin,
      currentMax,
      minVal,
      maxVal
    })
  }, [minValue, maxValue, currentMin, currentMax, minVal, maxVal])

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    console.log('RangeSlider min change:', {
      rawValue: value,
      currentMinVal: minVal,
      currentMaxVal: maxVal,
      step,
      minValue,
      maxValue
    })

    // Simples validação para garantir que min não seja maior que max
    const newMinVal = Math.min(value, maxVal - step)
    setMinVal(newMinVal)
    onChange(newMinVal, maxVal)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    console.log('RangeSlider max change:', {
      rawValue: value,
      currentMinVal: minVal,
      currentMaxVal: maxVal,
      step,
      minValue,
      maxValue
    })

    // Simples validação para garantir que max não seja menor que min
    const newMaxVal = Math.max(value, minVal + step)
    setMaxVal(newMaxVal)
    onChange(minVal, newMaxVal)
  }

  const defaultFormatValue = (value: number) => {
    return value.toLocaleString('pt-BR')
  }

  const displayFormatValue = formatValue || defaultFormatValue

  // Calcular percentual para posicionamento visual
  const getPercent = (value: number) => {
    if (maxValue === minValue) return 0
    const percent = ((value - minValue) / (maxValue - minValue)) * 100
    return Math.max(0, Math.min(100, percent)) // Garantir que esteja entre 0 e 100
  }

  const leftPercent = getPercent(minVal)
  const rightPercent = getPercent(maxVal)

  return (
    <div className="w-full space-y-4">

      {/* Labels com valores */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>{displayFormatValue(minVal)}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {displayFormatValue(minVal)} - {displayFormatValue(maxVal)}
        </span>
        <span>{displayFormatValue(maxVal)}</span>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Track de fundo */}
        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-lg relative">
          {/* Track ativo */}
          <div
            className="absolute h-2 bg-blue-500 dark:bg-blue-600 rounded-lg"
            style={{
              left: `${leftPercent}%`,
              width: `${rightPercent - leftPercent}%`,
            }}
          />
        </div>

        {/* Input min */}
        <input
          type="range"
          min={minValue}
          max={maxValue}
          value={minVal}
          step={step}
          onChange={handleMinChange}
          disabled={disabled}
          className="absolute top-0 left-0 w-full h-8 bg-transparent appearance-none cursor-pointer"
          style={{
            zIndex: 3,
          }}
        />

        {/* Input max */}
        <input
          type="range"
          min={minValue}
          max={maxValue}
          value={maxVal}
          step={step}
          onChange={handleMaxChange}
          disabled={disabled}
          className="absolute top-0 left-0 w-full h-8 bg-transparent appearance-none cursor-pointer"
          style={{
            zIndex: 4,
          }}
        />
      </div>

      {/* Valores min/max */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{displayFormatValue(minValue)}</span>
        <span>{displayFormatValue(maxValue)}</span>
      </div>
    </div>
  )
}
