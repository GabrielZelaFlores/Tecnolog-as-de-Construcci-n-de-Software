'use client'

import { useCallback, useEffect, useState } from 'react'
import { CloudSun, Droplets, RefreshCw, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n, type TranslationKey } from '@/i18n/I18nProvider'

const OPEN_METEO_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=-12.0464&longitude=-77.0428&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=America%2FLima'

interface WeatherResponse {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
  }
  current_units: {
    temperature_2m: string
    apparent_temperature: string
    relative_humidity_2m: string
    wind_speed_10m: string
  }
}

function weatherKey(code: number): TranslationKey {
  if (code === 0) return 'clearSky'
  if ([1, 2, 3].includes(code)) return 'partlyCloudy'
  if ([45, 48].includes(code)) return 'fog'
  if (code >= 51 && code <= 57) return 'drizzle'
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow'
  if (code >= 95) return 'storm'
  return 'unknownWeather'
}

export function ExternalWeather() {
  const { language, t } = useI18n()
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadWeather = useCallback(async (signal?: AbortSignal) => {
    setLoading(true)
    setError(false)
    try {
      const response = await fetch(OPEN_METEO_URL, { signal })
      if (!response.ok) throw new Error(`Open-Meteo: ${response.status}`)
      setWeather(await response.json() as WeatherResponse)
    } catch (requestError) {
      if (!(requestError instanceof DOMException && requestError.name === 'AbortError')) {
        setError(true)
      }
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const request = window.setTimeout(() => loadWeather(controller.signal), 0)
    return () => {
      window.clearTimeout(request)
      controller.abort()
    }
  }, [loadWeather])

  return (
    <Card className="mb-6 overflow-hidden border-sky-200 bg-gradient-to-r from-sky-50 to-background shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <CloudSun className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">{t('weatherTitle')}</h2>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800">
                {t('externalService')}
              </span>
            </div>
            {loading && <p className="mt-1 text-sm text-muted-foreground">{t('weatherLoading')}</p>}
            {error && (
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm text-red-600">{t('weatherError')}</p>
                <Button type="button" variant="link" size="sm" onClick={() => loadWeather()} className="h-auto p-0">
                  {t('retry')}
                </Button>
              </div>
            )}
            {weather && !loading && !error && (
              <p className="mt-1 text-sm text-muted-foreground">
                {t(weatherKey(weather.current.weather_code))} · {t('weatherUpdated')} {' '}
                {new Intl.DateTimeFormat(language, { hour: '2-digit', minute: '2-digit' }).format(new Date(weather.current.time))}
              </p>
            )}
          </div>
        </div>

        {weather && !error && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">{t('currentTemperature')}</p>
              <p className="text-xl font-bold">{weather.current.temperature_2m}{weather.current_units.temperature_2m}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('feelsLike')}</p>
              <p className="font-semibold">{weather.current.apparent_temperature}{weather.current_units.apparent_temperature}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-sky-600" aria-hidden="true" />
              <span>{weather.current.relative_humidity_2m}{weather.current_units.relative_humidity_2m}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-sky-600" aria-hidden="true" />
              <span>{weather.current.wind_speed_10m} {weather.current_units.wind_speed_10m}</span>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => loadWeather()} disabled={loading} aria-label={t('reload')}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
