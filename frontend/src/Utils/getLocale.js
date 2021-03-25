import axios from 'axios'

export default async function getLocale (zip_code) {
  try {
    
    if (!zip_code) return null
    
    const numberPattern = /\d+/g
    zip_code = zip_code.match(numberPattern)
    zip_code = zip_code.map(x => x).join('')
    
    if (zip_code.length < 8) return

    const url = `https://viacep.com.br/ws/${zip_code}/json`

    const response = await axios.get(url)

    const { data } = response

    return {
      state: data.uf,
      city: data.localidade,
      neighborhood: data.bairro,
      street: data.logradouro
    }
  } catch (error) {
    return null
  }
}
