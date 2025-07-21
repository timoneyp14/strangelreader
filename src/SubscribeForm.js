import React, { useState } from 'react';

function SubscribeForm() {
  const [email, setEmail] = useState('');

  // These important values are taken directly from the Mailchimp code
  const postUrl = 'https://gmail.us7.list-manage.com/subscribe/post?u=9bfb18f397336b3b1a27c61b3&id=6098e07a4c&f_id=006b30e0f0';

  return (
    <form
      action={postUrl}
      method="post"
      name="mc-embedded-subscribe-form"
      target="_blank"
      noValidate
      className="subscription-form"
    >
      <input
        type="email"
        name="EMAIL"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* This is a hidden field from Mailchimp to prevent bot signups. Do not remove it. */}
      <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
        <input type="text" name="b_9bfb18f397336b3b1a27c61b3_6098e07a4c" tabIndex="-1" defaultValue="" />
      </div>

      <button type="submit" name="subscribe">
        Subscribe
      </button>
    </form>
  );
}

export default SubscribeForm;