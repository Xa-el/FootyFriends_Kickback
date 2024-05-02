<script lang="ts">
	import { auth } from '$lib/firebase';
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let resetEmail: string = '';
	let errorMessage: string = '';
	let showError: boolean = false;

	async function forgotPassword() {
		try {
			await sendPasswordResetEmail(auth, resetEmail);
			errorMessage = "Password reset email sent successfully. Please check your inbox.";
			showError = true;
			// Navigate to the login page after sending the reset email
			goto('/login');
		} catch (error) {
			showError = true;
		}
	}
</script>

<style>
    .full-height {
        height: 100vh; /* This ensures the parent div takes the full height */
    }
    .neonLine{
        outline: 1px solid #6A863D; /* Sets width, style, and color */
        border-radius: 10px;
        width: 650px; /* Sets the width of the main container */
        height: 450px; /* Sets the height of the main container */
    }
    .inputButton{
        outline: 2px solid #6A863D;
        border-radius: 5px;
        background: #002615;
        color: white;
        border: none;
        width: 375px; /* Sets the width of the button */
        height: 50px; /* Sets the height of the button */
        font-size: 18px; /* Adjust this based on your preference */
        padding: 0 15px; /* Horizontal padding, vertical padding is not necessary due to height setting */
        text-align: left;
        line-height: 50px; /* This helps center the text vertically */
    }
    .centy{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    form{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .loginButt{
        border: none;
        border-radius: 5px;
        width: 230px;
        height: 200px;
        background: #002615;
        font-size: 30px;
    }

    .newActions{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
    }
    .createButton{
        border: none;
        background: #C3F53C;
        border-radius: 5px;
        width: 230px;
        height: 50px;
        font-size: 20px;
    }
    .header {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        align-items: center;
        color: #C3F53C; /* Neon green text */
        background: #013A21;
    }
    .header .logo {
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
    }

</style>

<div class="flex items-center justify-center h-[calc(100vh-60px)]">
	<div class="p-4 bg-side-green neonLine">
		<div class="centy">
			<h1 class="text-neon-green text-center font-extrabold text-4xl">Reset Account</h1>
			<form on:submit={forgotPassword()}>
				<input class="m-2 inputButton"bind:value={resetEmail} type="text" placeholder="Email" />
				<br>
				<button class="loginButt text-white font-bold" type="submit">Reset Password</button>
			</form>
		</div>
	</div>
	</div>





<!--<div class="forgot-password-container">-->
<!--	<h1>Forgot Password</h1>-->
<!--	<p>Enter your email below to reset your password.</p>-->
<!--	<form on:submit={forgotPassword}>-->
<!--		<input type="email" placeholder="Your Email" bind:value={resetEmail} required>-->
<!--		<button type="submit">Reset Password</button>-->
<!--	</form>-->
<!--	<p class="error-message" class:error={showError}>{errorMessage}</p>-->
<!--</div>-->
