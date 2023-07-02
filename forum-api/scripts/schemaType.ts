import { convertFromDirectory } from 'joi-to-typescript'

convertFromDirectory({
    schemaDirectory: 'src/schema',
    typeOutputDirectory: 'src/types/schema',
})
