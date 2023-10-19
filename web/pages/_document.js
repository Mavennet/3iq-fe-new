import React from 'react'
import Document, {Html, Head, Main, NextScript} from 'next/document'
import client from '../client'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return client.fetch('*[_id == "global-config"] {lang}.lang[0]').then((lang) => {
      return {...initialProps, lang}
    })
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-P2CW2MZB');`,
            }}
          />
          <link rel="icon" href="./static/favicon.ico?v=3" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Alata&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-P2CW2MZB"
              height="0"
              width="0"
              style={{display: 'none', visibility: 'hidden'}}
            ></iframe>
          </noscript>
        </body>
      </Html>
    )
  }
}
