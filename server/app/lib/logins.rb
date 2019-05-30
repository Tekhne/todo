class Logins
  include CustomExceptions

  class InvalidCredentials < CustomError; end
  class UnconfirmedEmailAddress < CustomError; end

  def authenticate(params)
    username_credential = UsernameCredential
      .find_by(username: params[:username])
      &.authenticate(params[:password])

    raise InvalidCredentials.new unless username_credential

    unless username_credential.account.email_address.confirmed
      raise UnconfirmedEmailAddress.new
    end

    username_credential.account
  end
end
