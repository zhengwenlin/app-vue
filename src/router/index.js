import Vue from 'vue'
import Router from 'vue-router'
// const Login = () => import('@/views/login')
//const Login = () =>  import('@/components/login/login.vue')
//const Home = () =>  import('@/components/home/home')
//const Announcement = () =>  import('@/components/home/children/announcement')
//const Prosession = () => import('@/components/home/children/prosession')

import Login from '@/components/login/login.vue'
import Home from '@/components/home/home'

import Announcement from '@/components/home/children/announcement'

import QuestionList from '@/components/home/children/questionlist'
import QuestionBank from '@/components/home/children/questionbank'

import Traincourse from '@/components/home/studyonline/traincourse'
import Courseware from '@/components/home/studyonline/courseware'
import Column from '@/components/home/studyonline/column'
import Coursewaredata from '@/components/home/studyonline/coursewaredata'

import Profession from '@/components/home/children/profession'

import Questionnaire from '@/components/home/activediscuss/questionnaire'
import Voting  from '@/components/home/activediscuss/voting'
import Activitys  from '@/components/home/activediscuss/activitys'
import Collection  from '@/components/home/activediscuss/collection'

import AddQuestionnaire from '@/components/common/addquestionnaire'
import EditQuestionnaire from '@/components/common/editquestionnaire'
import AddVoting from '@/components/common/addvoting'
import AddVctivity from '@/components/common/addActivity'

import CreateExam from '@/components/home/examonline/createexam'
import Exammanage from '@/components/home/examonline/exammanage'

import Maillist from '@/components/home/maillist/mailList'

import ArrangeWork from '@/components/home/arrangeWork/arrangeWork'

Vue.use(Router)

const router =  new Router({
  routes: [
   
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[
        {
          path:'/announcement',
          name:'announcement',
          component:Announcement
        },
        {
          path:'/questionlist',
          name:'questionlist',
          component:QuestionList
        },
        {
          path:'/questionbank',
          name:'questionbank',
          component:QuestionBank
        },
        {
          path:'/traincourse',
          name:'traincourse',
          component:Traincourse
        },
        {
          path:'/courseware',
          name:'courseware',
          component:Courseware
        },
        {
          path:'/column',
          name:'column',
          component:Column
        },
        {
          path:'/coursewaredata',
          name:'coursewaredata',
          component:Coursewaredata
        },
        {
          path:'/profession',
          name:'profession',
          component:Profession
        },
        {
          path:'/questionnaire',
          name:'questionnaire',
          component:Questionnaire
        },
        {
          path: '/addquestionnaire',
          name: 'addquestionnaire',
          component: AddQuestionnaire
        },
        {
          path: '/addActivity',
          name: 'addActivity',
          component: AddVctivity
        },
        {
          path: '/editquestionnaire',
          name: 'editquestionnaire',
          component: EditQuestionnaire
        },
        {
          path: '/voting',
          name: 'voting',
          component: Voting
        },
        {
          path: '/addvoting',
          name: 'addvoting',
          component: AddVoting
        },
        {
          path: '/activitys',
          name: 'activitys',
          component: Activitys
        },
        {
          path: '/collection',
          name: 'collection',
          component: Collection
        },
        {
          path: '/createexam',
          name: 'createexam',
          component: CreateExam
        },
        {
          path: '/exammanage',
          name: 'exammanage',
          component: Exammanage
        },
        {
          path: '/mailList',
          name: 'mailList',
          component: Maillist
        },
        {
          path: '/arrangeWork',
          name: 'arrangeWork',
          component: ArrangeWork
        },
        
        
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.name === 'login') {
    next()
  } else {
    const createId = sessionStorage.getItem('createId')
    if (!createId) {
      router.push({
        'name': 'login'
      })
     
      return
    }
    next()
  }
})
export default router