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
    attr_accessor :errors

    def initialize(**kwargs)
      @errors = kwargs.delete(:errors)
      super(kwargs.delete(:message), **kwargs)
    end
  end
end
