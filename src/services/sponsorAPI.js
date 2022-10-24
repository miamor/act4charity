import { APIServices } from './APIServices'

export const getNatalChart = (payload) => {
  // //console.log(' --- payload', payload)
  // //console.log(' --- ', new URLSearchParams(payload).toString())
  return APIServices().makeAuthRequest({
    url: '/php_astrology_scripts/natal_form_wheel.php',
    method: 'POST',
    data: new URLSearchParams(payload).toString()
  })
}