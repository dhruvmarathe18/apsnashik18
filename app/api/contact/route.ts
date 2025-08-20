import nodemailer from 'nodemailer'

export const runtime = 'nodejs' as const
export const maxDuration = 10

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    if (!name || !email || !phone || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    return Response.json({ success: true, message: 'Message sent successfully!' }, { headers: { 'Access-Control-Allow-Origin': '*' } })
  } catch (error) {
    console.error('Email error:', error)
    return Response.json({ error: 'Failed to send message. Please try again later.' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } })
  }
}


