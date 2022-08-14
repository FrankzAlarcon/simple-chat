import Head from "next/head"

interface Props {
  children: JSX.Element,
  titleName: string
}

export const Layout = ({children, titleName}: Props) => {
  const titleMessage = `Simple Chat | ${titleName ? titleName : 'Home'}`
  return (
    <>
      <Head>
        <title>{titleMessage}</title>
      </Head>
      <div>
        <header className='w-full bg-green-400 mb-5'>
          <h1 className='text-center text-3xl font-black py-5 uppercase'>Simple Chat</h1>
        </header>
        {
          children
        }
      <footer className='mt-10 h-20 bg-green-400 w-full flex items-center justify-center'>
        <p className='text-center text-gray-800'>
          © {new Date().getFullYear()} Simple Chat <span className='text-xs font-bold'>by Frankz Alarcon</span>
        </p>
      </footer>
      </div>
    </>
  )
}

