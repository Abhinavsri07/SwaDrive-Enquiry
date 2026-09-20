/**
 * SwaDrive - Contact & Enquiry Form
 * Pure Vanilla JavaScript Client-Side Validation & Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element References
  const form = document.getElementById('contactForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const successBanner = document.getElementById('successBanner');
  const resetSuccessBtn = document.getElementById('resetSuccessBtn');
  const subjectTagBtns = document.querySelectorAll('.subject-tag-btn');

  // Error Containers
  const fullNameError = document.getElementById('fullNameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  // Regex Patterns
  // Email regex conforming to standard RFC-compliant pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Indian 10-digit mobile number regex:
  // Must start with 6, 7, 8, or 9, followed by exactly 9 digits
  const indianPhoneRegex = /^[6-9]\d{9}$/;

  // Name regex: Letters, spaces, dots, hyphens, and apostrophes (min 2 characters)
  const nameRegex = /^[a-zA-Z\s.'-]{2,60}$/;

  /**
   * Display error message and mark field as invalid
   * @param {HTMLElement} inputElement - The input or select element
   * @param {HTMLElement} errorElement - The corresponding error container
   * @param {string} message - Descriptive error message to display
   */
  function showError(inputElement, errorElement, message) {
    inputElement.classList.add('has-error');
    inputElement.setAttribute('aria-invalid', 'true');

    // Handle special phone wrapper container if applicable
    if (inputElement.id === 'phone') {
      const phoneWrapper = inputElement.closest('.phone-wrapper');
      if (phoneWrapper) {
        phoneWrapper.classList.add('has-error');
      }
    }

    errorElement.innerHTML = `
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <span>${message}</span>
    `;
    errorElement.classList.add('is-visible');
  }

  /**
   * Clear error message and reset field invalid styling
   * @param {HTMLElement} inputElement - The input or select element
   * @param {HTMLElement} errorElement - The corresponding error container
   */
  function clearError(inputElement, errorElement) {
    inputElement.classList.remove('has-error');
    inputElement.removeAttribute('aria-invalid');

    if (inputElement.id === 'phone') {
      const phoneWrapper = inputElement.closest('.phone-wrapper');
      if (phoneWrapper) {
        phoneWrapper.classList.remove('has-error');
      }
    }

    errorElement.innerHTML = '';
    errorElement.classList.remove('is-visible');
  }

  /**
   * Sanitize and format phone input:
   * Strips spaces, dashes, or optional +91/91 country prefix
   * @param {string} rawPhone
   * @returns {string} 10-digit candidate string
   */
  function cleanPhoneNumber(rawPhone) {
    let cleaned = rawPhone.trim().replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  }

  /**
   * Validate Full Name field
   * @returns {boolean} Whether the field is valid
   */
  function validateFullName() {
    const value = fullNameInput.value.trim();

    if (value === '') {
      showError(fullNameInput, fullNameError, 'Full name is required.');
      return false;
    }

    if (value.length < 2) {
      showError(fullNameInput, fullNameError, 'Full name must be at least 2 characters.');
      return false;
    }

    if (!nameRegex.test(value)) {
      showError(fullNameInput, fullNameError, 'Please enter a valid full name (letters and spaces only).');
      return false;
    }

    clearError(fullNameInput, fullNameError);
    return true;
  }

  /**
   * Validate Email Address field
   * @returns {boolean} Whether the field is valid
   */
  function validateEmail() {
    const value = emailInput.value.trim();

    if (value === '') {
      showError(emailInput, emailError, 'Email address is required.');
      return false;
    }

    if (!emailRegex.test(value)) {
      showError(emailInput, emailError, 'Please enter a valid email address (e.g., name@example.com).');
      return false;
    }

    clearError(emailInput, emailError);
    return true;
  }

  /**
   * Validate Phone Number field
   * Accepts valid 10-digit Indian mobile number
   * @returns {boolean} Whether the field is valid
   */
  function validatePhone() {
    const rawValue = phoneInput.value.trim();

    if (rawValue === '') {
      showError(phoneInput, phoneError, 'Phone number is required.');
      return false;
    }

    const cleaned = cleanPhoneNumber(rawValue);

    if (!indianPhoneRegex.test(cleaned)) {
      showError(
        phoneInput,
        phoneError,
        'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
      );
      return false;
    }

    clearError(phoneInput, phoneError);
    return true;
  }

  /**
   * Validate Subject / Requirement field
   * Supports both custom manual entry and chosen suggestions
   * @returns {boolean} Whether the field is valid
   */
  function validateSubject() {
    const value = subjectInput.value.trim();

    if (value === '') {
      showError(subjectInput, subjectError, 'Please choose or type your subject / requirement.');
      return false;
    }

    if (value.length < 2) {
      showError(subjectInput, subjectError, 'Requirement must be at least 2 characters.');
      return false;
    }

    clearError(subjectInput, subjectError);
    return true;
  }

  /**
   * Validate Message field
   * @returns {boolean} Whether the field is valid
   */
  function validateMessage() {
    const value = messageInput.value.trim();

    if (value === '') {
      showError(messageInput, messageError, 'Message is required.');
      return false;
    }

    if (value.length < 10) {
      showError(messageInput, messageError, 'Message must be at least 10 characters long.');
      return false;
    }

    clearError(messageInput, messageError);
    return true;
  }

  // -------------------------------------------------------------------------
  // Real-time Error Removal (EventListeners on user input)
  // -------------------------------------------------------------------------
  fullNameInput.addEventListener('input', () => {
    if (fullNameInput.classList.contains('has-error')) {
      validateFullName();
    }
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('has-error')) {
      validateEmail();
    }
  });

  phoneInput.addEventListener('input', () => {
    if (phoneInput.classList.contains('has-error')) {
      validatePhone();
    }
  });

  subjectInput.addEventListener('input', () => {
    if (subjectInput.classList.contains('has-error')) {
      validateSubject();
    }
  });

  subjectInput.addEventListener('change', () => {
    if (subjectInput.classList.contains('has-error')) {
      validateSubject();
    }
  });

  // Quick preset buttons: clicking fills the input and triggers validation
  subjectTagBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedVal = btn.getAttribute('data-val');
      if (selectedVal) {
        subjectInput.value = selectedVal;
        clearError(subjectInput, subjectError);
        subjectInput.focus();

        // Highlight selected tag visually
        subjectTagBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      }
    });
  });

  // When user types manually in subject, remove tag highlight if custom text entered
  subjectInput.addEventListener('input', () => {
    const currentVal = subjectInput.value.trim().toLowerCase();
    subjectTagBtns.forEach((b) => {
      const tagVal = (b.getAttribute('data-val') || '').toLowerCase();
      if (tagVal === currentVal) {
        b.classList.add('is-active');
      } else {
        b.classList.remove('is-active');
      }
    });
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.classList.contains('has-error')) {
      validateMessage();
    }
  });

  // Optional: Also validate on blur so errors can be caught gently as users tab out
  fullNameInput.addEventListener('blur', () => {
    if (fullNameInput.value.trim() !== '') {
      validateFullName();
    }
  });

  emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim() !== '') {
      validateEmail();
    }
  });

  phoneInput.addEventListener('blur', () => {
    if (phoneInput.value.trim() !== '') {
      validatePhone();
    }
  });

  messageInput.addEventListener('blur', () => {
    if (messageInput.value.trim() !== '') {
      validateMessage();
    }
  });

  // -------------------------------------------------------------------------
  // Reset Button in Success Banner (Submit Another Enquiry)
  // -------------------------------------------------------------------------
  if (resetSuccessBtn) {
    resetSuccessBtn.addEventListener('click', () => {
      successBanner.classList.remove('is-visible');
      form.style.display = 'flex';
      fullNameInput.focus();
    });
  }

  // -------------------------------------------------------------------------
  // Form Submission Handler
  // -------------------------------------------------------------------------
  form.addEventListener('submit', (event) => {
    // 1. Prevent default form submission
    event.preventDefault();

    // 2. Validate all fields
    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid;

    // 3. Stop submission if any validation fails
    if (!isFormValid) {
      // Focus the first invalid field for accessibility
      const firstInvalid = form.querySelector('.has-error');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // 4. Form is valid -> Proceed with success display
    // Disable submit button briefly to give clear feedback
    submitBtn.disabled = true;
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      <span>Submitting...</span>
    `;

    setTimeout(() => {
      // Restore submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;

      // 5. Show professional success message
      successBanner.classList.add('is-visible');

      // Scroll smoothly to success banner if out of view
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // 6. Reset form
      form.reset();

      // Clear any remaining error marks
      clearError(fullNameInput, fullNameError);
      clearError(emailInput, emailError);
      clearError(phoneInput, phoneError);
      clearError(subjectInput, subjectError);
      clearError(messageInput, messageError);
      subjectTagBtns.forEach((b) => b.classList.remove('is-active'));
    }, 400);
  });
});
