import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Shop from '@/components/Shop'
import Product from '@/components/Product'
import Post from '@/components/Post'
import Cart from '@/components/Cart'
import Layout from '@/components/Layout'
import Login from '../views/login/login.vue'
import Register from '../views/register/Register.vue'
import Profile from '../views/edituser/Edituser.vue'
import Store from '../views/store/Store.vue'
import Forgetpassword from '../views/forgetpassword/Forgetpass.vue'
import ForgetpasswordRecoverycode from '../views/forgetpassword/Forgetpass_recovery.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/',
          component: Home,
          name: 'Home'
        },
        {
          path: '/shop',
          component: Shop,
          name: 'Shop'
        },
        {
          path: '/product',
          component: Product,
          name: 'Product'
        },
        {
          path: '/post',
          component: Post,
          name: 'Post'
        },
        {
          path: '/cart',
          component: Cart,
          name: 'Cart'
        },
        {
          path: '/profile',
          component: Profile,
          name: 'Profile'
        }
      ]
    },
    // login
    {
      path: '/login',
      component: Login,
      name: 'Login'
    },
    {
      path: '/register',
      component: Register,
      name: 'Register'
    },
    {
      path: '/forgetpass',
      component: Forgetpassword,
      name: 'ForgetPassword'
    },
    {
      path: '/recoverycode',
      component: ForgetpasswordRecoverycode,
      name: 'ForgetpasswordRecoverycode'
    },
    {
      path: '/store',
      component: Store,
      name: 'Store'
    }
  ],
  mode: 'history'
},

)
