import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import Search from 'components/search/search'
import Disc from 'components/disc/disc'
import singerDetail from 'components/singerDetail/singerDetail'
import Toplist from 'components/toplist/toplist'
import Favourite from 'components/favourite/favourite'
Vue.use(Router)
export default new Router({
  mode:'history',
  routes: [
  	{
      path: '/',
      redirect: '/recommend',
      component:Recommend
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path:'/rank',
      component:Rank,
      children:[
        {
          path:':id',
          component:Toplist
        }
      ]
    },
    {
      path:'/search',
      component:Search,
      children:[
        {
          path:':id',
          component:singerDetail
        }
      ]
    },
    {
      path:'/singer',
      component:Singer,
      children:[
        {
          path:':id',
          component:singerDetail
        }
      ]
    },
    {
      path:'/Favourite',
      component:Favourite
    }
  ]
})
