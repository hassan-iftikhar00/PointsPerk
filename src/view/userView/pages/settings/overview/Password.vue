<template>
  <ChangePasswordWrapper>
    <sdCards>
      <template v-slot:title>
        <div class="setting-card-title">
          <sdHeading as="h4">Password Settings</sdHeading>
          <span>Change your account password</span>
        </div>
      </template>

      <a-row type="flex" justify="center">
        <a-col :lg="12" :sm="20" :xs="24">
          <BasicFormWrapper>
            <!-- Display Success Message After New User Creation -->
            <MessageDisplay v-if="successMessage" :message="successMessage" type="success" />

            <!-- Display Errors -->
            <MessageDisplay v-if="errors" :message="errors" type="error" />

            <a-form @submit.prevent="handleSubmit" layout="vertical">
              <a-form-item label="New Password">
                <a-input-password
                  type="password"
                  v-model:value="credentials.newPassword"
                  placeholder="Password"
                  required
                  minlength="8"
                >
                  <template #prefix>
                    <unicon name="lock" width="18"></unicon>
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item name="new" label="Confirm New Password">
                <a-input-password
                  type="password"
                  v-model:value="credentials.confirmNewPassword"
                  placeholder="Password"
                  required
                  minlength="8"
                >
                  <template #prefix>
                    <unicon name="lock" width="18"></unicon>
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item>
                <div class="setting-form-actions">
                  <sdButton :disabled="isLoading" htmlType="submit" type="primary">
                    {{ isLoading ? 'Loading...' : 'Change Password' }}
                  </sdButton>
                </div>
              </a-form-item>
            </a-form>
          </BasicFormWrapper>
        </a-col>
      </a-row>
    </sdCards>
  </ChangePasswordWrapper>
</template>

<script>
import { ChangePasswordWrapper } from './style';
import { BasicFormWrapper } from '@/view/styled';
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import MessageDisplay from '@/view/userView/authentication/overview/MessageDisplay.vue';

const Password = defineComponent({
  name: 'Password',
  components: { ChangePasswordWrapper, BasicFormWrapper, MessageDisplay },

  setup() {
    const host = 'http://localhost:5000';
    const credentials = ref({ newPassword: '', confirmNewPassword: '' });
    const successMessage = ref('');
    const errors = ref('');
    const { state } = useStore();
    const isLoading = computed(() => state.auth.loading);

    const handleSubmit = async () => {
      successMessage.value = '';
      errors.value = '';
      state.auth.loading = true;

      try {
        const response = await fetch(`${host}/api/auth/user/update-user/updatePassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
          body: JSON.stringify(credentials.value),
        });

        const json = await response.json();
        if (json.success) {
          successMessage.value = 'Password reset successfully!';
          state.auth.loading = false;
        } else {
          errors.value = json.error;
          state.auth.loading = false;
          if (json.errors) {
            json.errors.forEach((error) => {
              errors.value[error.param] = error.msg;
            });
          }
        }
      } catch (error) {
        errors.value = error;
        state.auth.loading = false;
      }
    };

    const onChange = (e) => {
      credentials.value = { ...credentials.value, [e.target.name]: e.target.value };
    };

    onMounted(() => {
      state.auth.loading = false;
    });

    return {
      credentials,
      successMessage,
      errors,
      handleSubmit,
      onChange,
      isLoading
    };
  },
});

export default Password;
</script>
