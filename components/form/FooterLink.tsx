import Link from 'next/link'
import React from 'react'

const FooterLink = ({ text, linkText, href }: FooterLinkProps) => {
    return (
        <div className='text-center pt-6'>
            <p className='text-sm text-gray-400'>
                {text}{' '}
                <Link
                    href={href}
                    className="text-green-400 font-medium hover:text-green-300 transition-colors duration-200 underline-offset-4 hover:underline"
                >{linkText}</Link>
            </p>
        </div>
    )
}

export default FooterLink