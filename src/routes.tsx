import { Route, Routes } from 'react-router-dom'
import Movies from './components/pages/Movies'
import Starred from './components/pages/Starred'
import WatchLater from './components/pages/WatchLater'
import PageNotFound from './components/pages/PageNotFound'

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<Movies />} />
    <Route path='/starred' element={<Starred />} />
    <Route path='/watch-later' element={<WatchLater />} />
    <Route path='*' element={<PageNotFound />} />
  </Routes>
)

export default AppRoutes
