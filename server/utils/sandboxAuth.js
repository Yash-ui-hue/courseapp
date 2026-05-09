const getSandboxAuth = () => {
  return process.env.SANDBOX_API_KEY;
};

module.exports = getSandboxAuth;