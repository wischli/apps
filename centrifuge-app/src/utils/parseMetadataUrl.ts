const IFPS_GATEWAY = import.meta.env.REACT_APP_IPFS_GATEWAY

export function isUrl(url: string) {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch (e) {
    return false
  }
}

export function parseMetadataUrl(url: string) {
  try {
    let newUrl

    if (!url.includes(':')) {
      // string without protocol is assumed to be an IPFS hash
      newUrl = new URL(`ipfs/${url}`, IFPS_GATEWAY)
    } else if (url.startsWith('ipfs://ipfs/')) {
      newUrl = new URL(url.slice(12), IFPS_GATEWAY)
    } else if (url.startsWith('ipfs://')) {
      newUrl = new URL(url.slice(7), IFPS_GATEWAY)
    } else {
      newUrl = new URL(url)
    }

    if (newUrl.protocol === 'http:' || newUrl.protocol === 'https:') {
      return newUrl.href
    }

    return ''
  } catch (e) {
    return ''
  }
}
