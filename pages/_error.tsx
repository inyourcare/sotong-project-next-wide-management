import { NextApiResponse } from "next"
import { ErrorProps } from "next/error"

function Error({ statusCode }: { statusCode: string }) {
    return (
        <p>
            {statusCode
                ? `An error ${statusCode} occurred on server`
                : 'An error occurred on client'}
        </p>
    )
}

Error.getInitialProps = ({ res, err }: { res: NextApiResponse, err: ErrorProps }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
