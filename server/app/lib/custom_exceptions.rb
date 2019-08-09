module CustomExceptions
  class CustomError < StandardError
    attr_accessor :original

    def initialize(message = nil, **kwargs)
      super(message)
      @original = kwargs[:original]
    end
  end

  class ServiceError < CustomError
    def initialize(**kwargs)
      super(kwargs.delete(:message), **kwargs)
    end
  end

  class ParamErrors < CustomError
    attr_accessor :error, :errors

    def initialize(**kwargs)
      @error = kwargs.delete(:error)
      @errors = kwargs.delete(:errors)
      super(kwargs.delete(:message), **kwargs)
    end
  end
end
