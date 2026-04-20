import Footer from '../components/Footer'
import Header from '../components/Header'
import PublicRouter from '../Router/PublicRouter'

const Layout = () => {
  return (
    <div className='flex flex-col justify-between overflow-x-hidden' >
        <Header />
        <main className='' >
            <PublicRouter />
        </main>
        <Footer />
    </div>
  )
}

export default Layout