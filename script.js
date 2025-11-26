document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loanForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const statusMessage = document.getElementById('statusMessage');

    // Clear previous session data
    localStorage.removeItem('loan_app_id');
    localStorage.removeItem('loan_amount');

    // Validation Regex Patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        mobile: /^\d{10}$/,
        aadhar: /^\d{12}$/,
        pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        pincode: /^\d{6}$/
    };

    // Real-time validation for specific fields to improve UX
    const inputs = {
        mobile: document.getElementById('mobile'),
        email: document.getElementById('email'),
        aadhar: document.getElementById('aadhar'),
        pan: document.getElementById('pan'),
        pincode: document.getElementById('pincode')
    };

    // Helper to show/clear errors
    function setError(input, message) {
        const errorSpan = document.getElementById(input.id + 'Error');
        if (errorSpan) {
            errorSpan.textContent = message;
            input.classList.add('error');
        }
    }

    function clearError(input) {
        const errorSpan = document.getElementById(input.id + 'Error');
        if (errorSpan) {
            errorSpan.textContent = '';
            input.classList.remove('error');
        }
    }

    // Attach input listeners for clearing errors on type
    Object.values(inputs).forEach(input => {
        if (input) {
            input.addEventListener('input', function () {
                clearError(this);
                // Auto-uppercase PAN
                if (this.id === 'pan') {
                    this.value = this.value.toUpperCase();
                }
            });
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Reset status
        statusMessage.style.display = 'none';
        statusMessage.className = 'status-message';
        let isValid = true;

        // Validate Mobile
        if (!patterns.mobile.test(inputs.mobile.value)) {
            setError(inputs.mobile, 'Please enter a valid 10-digit mobile number');
            isValid = false;
        }

        // Validate Email
        if (!patterns.email.test(inputs.email.value)) {
            setError(inputs.email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Aadhar
        if (!patterns.aadhar.test(inputs.aadhar.value)) {
            setError(inputs.aadhar, 'Please enter a valid 12-digit Aadhar number');
            isValid = false;
        }

        // Validate PAN
        if (!patterns.pan.test(inputs.pan.value)) {
            setError(inputs.pan, 'Please enter a valid PAN number (e.g., ABCDE1234F)');
            isValid = false;
        }

        // Validate PIN Code
        if (!patterns.pincode.test(inputs.pincode.value)) {
            setError(inputs.pincode, 'Please enter a valid 6-digit PIN code');
            isValid = false;
        }

        // Validate Terms & Conditions
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            alert('Please agree to the Terms & Conditions before submitting.');
            isValid = false;
        }

        if (!isValid) {
            // Shake animation for visual feedback
            submitBtn.classList.add('shake');
            setTimeout(() => submitBtn.classList.remove('shake'), 500);
            return;
        }

        // Prepare Data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Add timestamp
        data.timestamp = new Date().toISOString();

        // Show Loading State
        submitBtn.disabled = true;
        btnText.textContent = 'Checking Offers...';
        btnLoader.style.display = 'block';

        // Google Apps Script URL
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVyK5J4spUx72AHBk6gkUPZoWyNGGSthojCayoi1djtrPYBDrRI0RCBEfdaPqVqAOK/exec";

        // Send Data
        fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data)
        })
            .then(() => {
                // Success Handler - Redirect to processing page
                window.location.href = 'processing.html';
            })
            .catch(error => {
                console.error('Error:', error);
                showStatus('Something went wrong. Please check your connection.', 'error');
                // Reset Button State on error
                submitBtn.disabled = false;
                btnText.textContent = 'Check Offers';
                btnLoader.style.display = 'none';
            });
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';

        // Auto hide after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
});
