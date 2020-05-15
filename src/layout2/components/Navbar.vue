<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <div class="avatar-wrapper"> -->
      <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
      <!-- <img :src="avatar" class="avatar"> -->
      <!-- </div> -->

      <div class="welcome">欢迎您，{{ name }}</div>
      <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
        <div class="logout" @click="logout">
          <svg-icon icon-class="logout" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      // avatar: require('@/assets/images/ocean.png')
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 40px;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 4px;
    }
    .welcome {
      margin-right: 20px;
    }
    .logout {
      cursor: pointer;
      color: #B33038;
      .svg-icon {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
