class AuthenticatesController < ApplicationController
  SECRET_KEY = "secret_key"
  CREDENTIAL_TTL = 3600

  def authenticate
    peer_id = params['peerId']
    session_token = params['sessionToken']

    unless is_valid_params?
      render json: { status: 'BAD'}
      return
    end

    if check_session_token(peer_id, session_token)
      timestamp = Time.now.to_i
      credential = {
        peerId: peer_id,
        timestamp: timestamp,
        ttl: CREDENTIAL_TTL,
        authToken: generate_auth_token(peer_id, timestamp)
      }
      render json: credential
    else
      render json: { status: 'BAD'}
      return
    end

  end


  private
  def is_valid_params?
    return false if params['peerId'].nil? && params['sessionToken'].nil?
    return true
  end

  def check_session_token(peer_id, token)
    # TODO: sessionTokenのvalidation
    true
  end

  def generate_auth_token(peer_id, timestamp)
    message = "#{timestamp}:#{CREDENTIAL_TTL}:#{peer_id}"
    hash = OpenSSL::HMAC.digest(OpenSSL::Digest.new('sha256'), SECRET_KEY, message)
    Base64.encode64(hash).strip()
  end
end
