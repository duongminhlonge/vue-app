<template>
  <div class="profile-container">
    <h2 class="profile-title">My Profile</h2>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div class="profile-avatar-section">
      <img
        :src="customer.avatar || defaultAvatar"
        alt="Profile"
        class="profile-avatar"
      />
      <input type="file" @change="handleAvatarChange" class="avatar-input" />
    </div>

    <form @submit.prevent="updateProfile" class="profile-form">
      <div class="form-row">
        <div class="form-group half-width">
          <label for="firstName">First Name</label>
          <input id="firstName" v-model="customer.firstName" required />
        </div>

        <div class="form-group half-width">
          <label for="lastName">Last Name</label>
          <input id="lastName" v-model="customer.lastName" required />
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="customer.email"
          type="email"
          readonly
          class="readonly-input"
        />
      </div>

      <div class="form-group">
        <label for="gender">Gender</label>
        <select id="gender" v-model="customer.gender" required>
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button type="submit" class="submit-button">
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import '@/assets/css/MyProfile.css'

const defaultAvatar = 'https://via.placeholder.com/150'
const successMessage = ref('')

const customer = ref({
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  avatar: null,
})

const fetchCustomerData = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.error('No token found. Please log in.')
    return
  }

  try {
    const { data } = await axios.get('http://laravel_app.local/api/customer/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const c = data.customer || data

    customer.value.firstName = c.first_name || ''
    customer.value.lastName = c.last_name || ''
    customer.value.email = c.email || ''
    customer.value.gender = c.gender || ''
    customer.value.avatar = c.avatar || null

  } catch (error) {
    console.error('Error fetching customer data:', error)
  }
}

function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      customer.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function updateProfile() {
  const token = localStorage.getItem('token')
  if (!token) {
    console.error('No token found. Please log in.')
    return
  }

  try {
    const payload = {
      first_name: customer.value.firstName,
      last_name: customer.value.lastName,
      gender: customer.value.gender,
      avatar: customer.value.avatar,
    }

    const response = await axios.put('http://laravel_app.local/api/customer/update', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

    console.log('Updated customer:', response.data.customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    if (error.response?.data?.errors) {
      successMessage.value = 'Validation failed. Check inputs.'
    } else {
      successMessage.value = 'Failed to update profile. Please try again.'
    }
    setTimeout(() => {
      successMessage.value = ''
    }, 4000)
  }
}

onMounted(fetchCustomerData)
</script>
