import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = client ? createImageUrlBuilder(client) : null

export function urlFor(source: any) {
    if (!builder) {
        return { url: () => '', width: () => ({ height: () => ({ url: () => '' }), url: () => '' }) }
    }
    return builder.image(source)
}
