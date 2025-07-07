<template>
  <div class="profile-layout">
    <!-- Profile Info Section -->
    <div class="profile-left">
      <h2 class="profile-title">My Profile</h2>

      <div v-if="profileSuccessMessage" class="success-message">
        {{ profileSuccessMessage }}
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
            <input id="firstName" v-model="customer.firstName" />
            <div v-if="updateProfileErrors.firstName" class="field-error">
              {{ updateProfileErrors.firstName }}
            </div>
          </div>

          <div class="form-group half-width">
            <label for="lastName">Last Name</label>
            <input id="lastName" v-model="customer.lastName" />
            <div v-if="updateProfileErrors.lastName" class="field-error">
              {{ updateProfileErrors.lastName }}
            </div>
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

    <!-- Change Password Section -->
    <div class="profile-right">
      <h3 class="profile-title">Change Password</h3>

      <div v-if="passwordSuccessMessage" class="success-message">
        {{ passwordSuccessMessage }}
      </div>

      <form @submit.prevent="changePassword" class="profile-form">
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input id="currentPassword" v-model="passwordForm.current" type="password" />
          <div v-if="passwordErrors.current" class="field-error">
            {{ passwordErrors.current }}
          </div>
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input id="newPassword" v-model="passwordForm.new" type="password" />
          <div v-if="passwordErrors.new" class="field-error">
            {{ passwordErrors.new }}
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input id="confirmPassword" v-model="passwordForm.confirm" type="password" />
          <div v-if="passwordErrors.confirm" class="field-error">
            {{ passwordErrors.confirm }}
          </div>
        </div>

        <button type="submit" class="submit-button">
          Change Password
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import '@/assets/css/MyProfile.css'

const defaultAvatar = 'https://via.placeholder.com/150'

const profileSuccessMessage = ref('')
const passwordSuccessMessage = ref('')
const errorMessages = ref([])

const customer = ref({
  firstName: '',
  lastName: '',
  email: '',
  gender: '',
  avatar: null,
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

const updateProfileErrors = ref({
  firstName: '',
  lastName: '',
})

const passwordErrors = ref({
  current: '',
  new: '',
  confirm: '',
})

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

const fetchCustomerData = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.error('No token found.')
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
  if (!token) return console.error('No token found.')

  // Clear previous errors
  updateProfileErrors.value = {
    firstName: '',
    lastName: '',
  }

  let hasError = false

  if (!customer.value.firstName) {
    updateProfileErrors.value.firstName = 'First name is required.'
    hasError = true
  } else if (customer.value.firstName.length > 25) {
    updateProfileErrors.value.firstName = 'First name must be 25 characters or less.'
    hasError = true
  }

  if (!customer.value.lastName) {
    updateProfileErrors.value.lastName = 'Last name is required.'
    hasError = true
  } else if (customer.value.lastName.length > 25) {
    updateProfileErrors.value.lastName = 'Last name must be 25 characters or less.'
    hasError = true
  }

  if (hasError) return

  try {
    const payload = {
      first_name: customer.value.firstName,
      last_name: customer.value.lastName,
      gender: customer.value.gender,
      avatar: customer.value.avatar,
    }

    await axios.put('http://laravel_app.local/api/customer/update', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    profileSuccessMessage.value = 'Profile updated successfully!'
    errorMessages.value = []
    setTimeout(() => (profileSuccessMessage.value = ''), 3000)

  } catch (error) {
    errorMessages.value = ['Failed to update profile.']
    console.error('Profile update error:', error)
  }
}

async function changePassword() {
  const token = localStorage.getItem('token')
  if (!token) return console.error('No token found.')

  passwordErrors.value = {
    current: '',
    new: '',
    confirm: '',
  }

  let hasError = false

  if (!passwordForm.value.current) {
    passwordErrors.value.current = 'Current password is required.'
    hasError = true
  }

  if (!passwordForm.value.new) {
    passwordErrors.value.new = 'New password is required.'
    hasError = true
  } else if (!passwordPattern.test(passwordForm.value.new)) {
    passwordErrors.value.new =
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
    hasError = true
  }

  if (passwordForm.value.confirm !== passwordForm.value.new) {
    passwordErrors.value.confirm = 'Passwords do not match.'
    hasError = true
  }

  if (hasError) return

  try {
    await axios.put(
      'http://laravel_app.local/api/customer/change-password',
      {
        current_password: passwordForm.value.current,
        new_password: passwordForm.value.new,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    passwordSuccessMessage.value = 'Password changed successfully.'
    passwordForm.value.current = ''
    passwordForm.value.new = ''
    passwordForm.value.confirm = ''

    setTimeout(() => (passwordSuccessMessage.value = ''), 3000)
  } catch (error) {
    passwordErrors.value.current =
      error.response?.data?.message || 'Failed to change password.'
  }
}

onMounted(fetchCustomerData)
</script>
