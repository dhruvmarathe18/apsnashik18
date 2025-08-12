'use client'

import { motion } from 'framer-motion'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Share2,
  Users,
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function Social() {
  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/appleschool1/',
      followers: '2.5K+',
      posts: '500+',
      description: 'Connect with our school community on Facebook',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: '#',
      followers: '1.8K+',
      posts: '300+',
      description: 'Follow our visual journey on Instagram',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: '#',
      followers: '1.2K+',
      posts: '200+',
      description: 'Stay updated with our latest news and announcements',
      color: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: '#',
      followers: '500+',
      posts: '50+',
      description: 'Professional network for our alumni and staff',
      color: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: '#',
      followers: '800+',
      posts: '100+',
      description: 'Watch our school events and educational content',
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    }
  ]

  const recentPosts = [
    {
      platform: 'Facebook',
      content: 'Congratulations to our students for their outstanding performance in the annual sports day! Great teamwork and sportsmanship displayed by all participants.',
      likes: 45,
      comments: 12,
      shares: 8,
      date: '2 hours ago',
      image: '/images/kids.jpg'
    },
    {
      platform: 'Instagram',
      content: 'Our science exhibition was a huge success! Students showcased amazing projects demonstrating their creativity and scientific understanding.',
      likes: 89,
      comments: 15,
      shares: 5,
      date: '1 day ago',
      image: '/images/teacher-1.jpg'
    },
    {
      platform: 'Twitter',
      content: 'Join us for the upcoming cultural festival on Dec 15th! Students will perform music, dance, and drama. #CulturalFestival #SchoolEvents',
      likes: 23,
      comments: 7,
      shares: 12,
      date: '2 days ago',
      image: '/images/infra.jpg'
    }
  ]

  const socialStats = [
    { label: 'Total Followers', value: '6.8K+', icon: Users },
    { label: 'Total Posts', value: '1.1K+', icon: Share2 },
    { label: 'Total Engagement', value: '15K+', icon: Heart },
    { label: 'Monthly Reach', value: '25K+', icon: Eye }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Share2 className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="heading-primary mb-4"
          >
            Connect With Us on Social Media
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-gray-200 max-w-3xl mx-auto"
          >
            Stay connected with our AI-enhanced school community. Follow us for updates, events, and insights into our innovative educational approach.
          </motion.p>
        </div>
      </section>

      {/* Social Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Our Social Media Impact</h2>
            <p className="text-body max-w-3xl mx-auto">
              Join our growing community of students, parents, and educators.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {socialStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-dark-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Platforms Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Follow Us on Social Media</h2>
            <p className="text-body max-w-3xl mx-auto">
              Connect with us across multiple platforms to stay updated with our latest news, events, and achievements.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {socialPlatforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 ${platform.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <platform.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-dark-900 mb-2">{platform.name}</h3>
                <p className="text-dark-600 mb-4">{platform.description}</p>
                
                <div className="flex justify-center space-x-4 mb-6 text-sm">
                  <div>
                    <div className="font-semibold text-primary-600">{platform.followers}</div>
                    <div className="text-dark-500">Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary-600">{platform.posts}</div>
                    <div className="text-dark-500">Posts</div>
                  </div>
                </div>

                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block w-full py-3 px-6 rounded-lg text-white font-medium transition-colors duration-300 ${platform.color} ${platform.hoverColor}`}
                >
                  Follow on {platform.name}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-secondary mb-4">Recent Social Media Posts</h2>
            <p className="text-body max-w-3xl mx-auto">
              Check out our latest updates and engaging content from our social media channels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.platform}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-dark-900">
                      {post.platform}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-dark-600 mb-4 line-clamp-3">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-dark-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 className="w-4 h-4" />
                        <span>{post.shares}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 px-4 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors duration-300">
                    View on {post.platform}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facebook Integration Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-secondary mb-6">Connect on Facebook</h2>
              <p className="text-body mb-6">
                Our Facebook page is the hub of our school community. Join us to stay updated with:
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span>Latest school events and announcements</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span>Student achievements and success stories</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span>AI-enhanced learning insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span>Parent engagement and community updates</span>
                </li>
              </ul>
              
              <a
                href="https://www.facebook.com/appleschool1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
                <span>Visit Our Facebook Page</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900">Apple Public School Nashik</h3>
                    <p className="text-sm text-dark-500">@appleschool1</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-500">Followers</span>
                    <span className="font-semibold">2,500+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-500">Posts</span>
                    <span className="font-semibold">500+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-500">Engagement Rate</span>
                    <span className="font-semibold text-green-600">8.5%</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-dark-600 mb-3">
                    "Exciting to see our students embracing AI-enhanced learning! The future of education is here at APS Nashik."
                  </p>
                  <div className="flex items-center justify-between text-xs text-dark-500">
                    <span>2 hours ago</span>
                    <div className="flex items-center space-x-3">
                      <span>👍 45</span>
                      <span>💬 12</span>
                      <span>🔄 8</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary text-white mb-4">Join Our Social Media Community</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Stay connected with our AI-enhanced school community. Follow us for the latest updates, 
              events, and insights into innovative education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.facebook.com/appleschool1/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Facebook className="w-5 h-5 mr-2" />
                Follow on Facebook
              </a>
              <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
