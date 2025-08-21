import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function GET() {
  try {
    // Default data
    const defaultEvents = [
      {
        id: '1',
        title: 'Annual Sports Day',
        date: '2024-03-15',
        description: 'Annual sports competition for all students',
        category: 'Sports',
        status: 'upcoming'
      },
      {
        id: '2',
        title: 'Science Exhibition',
        date: '2024-02-20',
        description: 'Students showcase their science projects',
        category: 'Academic',
        status: 'completed'
      }
    ]

    const defaultGalleryImages = [
      {
        id: '1',
        title: 'Sports Day Celebration',
        category: 'School Events',
        src: '/images/kids.jpg',
        alt: 'Students during sports day',
        uploadDate: '2024-01-15'
      },
      {
        id: '2',
        title: 'Classroom Activity',
        category: 'Classroom Activities',
        src: '/images/teacher-1.jpg',
        alt: 'Students in classroom',
        uploadDate: '2024-01-10'
      }
    ]

    const defaultNewsArticles = [
      {
        id: '1',
        title: 'School Achieves 100% Board Results',
        content: 'Our school has achieved excellent results in the recent board examinations with 100% pass rate and outstanding performance by our students.',
        publishDate: '2024-01-20',
        status: 'published'
      }
    ]

    // Create ReadableStreams for each data type
    const createStream = (data: any) => {
      return new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()
          controller.enqueue(encoder.encode(JSON.stringify(data, null, 2)))
          controller.close()
        }
      })
    }

    // Initialize all data files
    const results = await Promise.all([
      put('content/events.json', createStream(defaultEvents), {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'application/json'
      }),
      put('content/gallery.json', createStream(defaultGalleryImages), {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'application/json'
      }),
      put('content/news.json', createStream(defaultNewsArticles), {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'application/json'
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Vercel Blob initialized with default data',
      results: results.map(r => ({ url: r.url, pathname: r.pathname }))
    })

  } catch (error) {
    console.error('Init blob error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
