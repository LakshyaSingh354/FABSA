import cookie from 'cookie';

export default function handler(req, res) {
    const token = req.body.token;
    res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
    );
    res.status(200).json({ success: true });
}