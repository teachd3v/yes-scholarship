const { Resend } = require('resend');
async function test() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log("Sending...");
  const res = await resend.emails.send({
      from: 'YES Scholarship <admin@youthekselensia.id>',
      to: ['dummy.testing.aidil.yes@gmail.com'],
      subject: 'Test Resend',
      html: '<p>Test</p>'
  });
  console.log(res);
}
test();
