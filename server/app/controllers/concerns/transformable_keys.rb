module TransformableKeys
  extend ActiveSupport::Concern

  private

  def js_keys(hash)
    return unless hash

    hash.deep_transform_keys { |key| key.to_s.camelcase(:lower) }
  end

  def rb_keys(params)
    return unless params

    params.to_h.deep_transform_keys { |key| key.to_s.underscore.to_sym }
  end
end
