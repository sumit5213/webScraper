import { LoaderCircle } from 'lucide-react';

const AuthForm = ({
  mode,
  values,
  error,
  loading,
  onChange,
  onSubmit
}) => {
  const isRegister = mode === 'register';

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {error ? <div className="form-error">{error}</div> : null}

      {isRegister ? (
        <label className="field">
          <span>Name</span>
          <input
            name="name"
            value={values.name}
            onChange={onChange}
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
          />
        </label>
      ) : null}

      <label className="field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={onChange}
          autoComplete="email"
          required
        />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={onChange}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          required
          minLength={8}
        />
      </label>

      <button className="primary-button wide" type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : null}
        {isRegister ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
};

export default AuthForm;
