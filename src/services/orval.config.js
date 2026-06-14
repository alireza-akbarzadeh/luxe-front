module.exports = [
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-account-orders-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/account/orders': {
            get: {
              description:
                'Returns paginated list of user orders including items with product details',
              parameters: [
                {
                  description: 'Items per page (default 10, max 50)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Pagination offset',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.OrderListResponseData'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get user order history',
              tags: ['Account']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.OrderListResponseData': {
              properties: {
                limit: {
                  type: 'integer'
                },
                offset: {
                  type: 'integer'
                },
                orders: {
                  items: {
                    $ref: '#/components/schemas/dto.OrderDetailDTO'
                  },
                  type: 'array'
                },
                total: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'dto.OrderDetailDTO': {
              properties: {
                created_at: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/dto.OrderItemDetailDTO'
                  },
                  type: 'array'
                },
                order_number: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                total_amount: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.OrderItemDetailDTO': {
              properties: {
                image_url: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                product_id: {
                  type: 'integer'
                },
                product_name: {
                  type: 'string'
                },
                quantity: {
                  type: 'integer'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-account-summary-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/account/summary': {
            get: {
              description:
                'Returns user profile, default addresses, address count, liked products count, and recent orders (max 3)',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.DashboardSummaryResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get user dashboard summary',
              tags: ['Account']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.DashboardSummaryResponse': {
              properties: {
                address_count: {
                  type: 'integer'
                },
                created_at: {
                  type: 'string'
                },
                default_billing_address: {
                  $ref: '#/components/schemas/dto.DefaultAddressDTO'
                },
                default_shipping_address: {
                  $ref: '#/components/schemas/dto.DefaultAddressDTO'
                },
                email: {
                  type: 'string'
                },
                first_name: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_name: {
                  type: 'string'
                },
                liked_products_count: {
                  type: 'integer'
                },
                phone: {
                  type: 'string'
                },
                recent_orders: {
                  items: {
                    $ref: '#/components/schemas/dto.OrderResponse'
                  },
                  type: 'array'
                },
                role: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.DefaultAddressDTO': {
              properties: {
                address_line1: {
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                phone: {
                  type: 'string'
                },
                postal_code: {
                  type: 'string'
                },
                state: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.OrderResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                order_number: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                total_amount: {
                  type: 'number'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-account-wishlist-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/account/wishlist': {
            get: {
              description:
                'Returns products the user has liked, with product details (image, price, name)',
              parameters: [
                {
                  description: 'Items per page (default 10, max 50)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Pagination offset',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Sort order (name, price-asc, price-desc)',
                  in: 'query',
                  name: 'sort',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.WishlistResponseData'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: "Get user's wishlist",
              tags: ['Account', 'Wishlist']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.WishlistResponseData': {
              properties: {
                items: {
                  items: {
                    $ref: '#/components/schemas/dto.WishlistItemDTO'
                  },
                  type: 'array'
                },
                limit: {
                  type: 'integer'
                },
                offset: {
                  type: 'integer'
                },
                total: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'dto.WishlistItemDTO': {
              properties: {
                color: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                discount_percent: {
                  type: 'integer'
                },
                image_url: {
                  type: 'string'
                },
                is_active: {
                  type: 'boolean'
                },
                is_in_stock: {
                  type: 'boolean'
                },
                old_price: {
                  type: 'number'
                },
                price: {
                  type: 'number'
                },
                product_id: {
                  type: 'integer'
                },
                product_name: {
                  type: 'string'
                },
                size: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                stock: {
                  type: 'integer'
                },
                stock_quantity: {
                  type: 'integer'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-addresses-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/addresses': {
            get: {
              description: 'Returns all saved addresses for the current user.',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  addresses: {
                                    items: {
                                      $ref: '#/components/schemas/models.Address'
                                    },
                                    type: 'array'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'List user addresses',
              tags: ['Addresses']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Address': {
              properties: {
                address_line1: {
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                address_type: {
                  enum: ['shipping', 'billing', 'both'],
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                instructions: {
                  type: 'string'
                },
                is_default: {
                  type: 'boolean'
                },
                phone: {
                  type: 'string'
                },
                postal_code: {
                  type: 'string'
                },
                recipient_name: {
                  type: 'string'
                },
                state: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              required: [
                'address_line1',
                'city',
                'country',
                'phone',
                'postal_code',
                'recipient_name'
              ],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-addresses-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/addresses': {
            post: {
              description:
                'Adds a new shipping, billing, or both type address for the current user.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateAddressRequest'
                    }
                  }
                },
                description: 'Address data including address_type (shipping, billing, both)',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.AddressSingleResponse'
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create address',
              tags: ['Addresses']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateAddressRequest': {
              properties: {
                address_line1: {
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                address_type: {
                  enum: ['shipping', 'billing', 'both'],
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                instructions: {
                  type: 'string'
                },
                is_default: {
                  type: 'boolean'
                },
                phone: {
                  type: 'string'
                },
                postal_code: {
                  type: 'string'
                },
                recipient_name: {
                  type: 'string'
                },
                state: {
                  type: 'string'
                }
              },
              required: [
                'address_line1',
                'address_type',
                'city',
                'country',
                'phone',
                'postal_code',
                'recipient_name'
              ],
              type: 'object'
            },
            'dto.AddressSingleResponse': {
              properties: {
                address: {
                  $ref: '#/components/schemas/models.Address'
                },
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Address': {
              properties: {
                address_line1: {
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                address_type: {
                  enum: ['shipping', 'billing', 'both'],
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                instructions: {
                  type: 'string'
                },
                is_default: {
                  type: 'boolean'
                },
                phone: {
                  type: 'string'
                },
                postal_code: {
                  type: 'string'
                },
                recipient_name: {
                  type: 'string'
                },
                state: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              required: [
                'address_line1',
                'city',
                'country',
                'phone',
                'postal_code',
                'recipient_name'
              ],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-addresses-default-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/addresses/default': {
            get: {
              description: 'Returns the default shipping or billing address for the current user.',
              parameters: [
                {
                  description: 'Address type (shipping/billing)',
                  in: 'query',
                  name: 'type',
                  schema: {
                    default: 'shipping',
                    enum: ['shipping', 'billing'],
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.AddressSingleResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get default address',
              tags: ['Addresses']
            }
          }
        },
        components: {
          schemas: {
            'dto.AddressSingleResponse': {
              properties: {
                address: {
                  $ref: '#/components/schemas/models.Address'
                },
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Address': {
              properties: {
                address_line1: {
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                address_type: {
                  enum: ['shipping', 'billing', 'both'],
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                instructions: {
                  type: 'string'
                },
                is_default: {
                  type: 'boolean'
                },
                phone: {
                  type: 'string'
                },
                postal_code: {
                  type: 'string'
                },
                recipient_name: {
                  type: 'string'
                },
                state: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              required: [
                'address_line1',
                'city',
                'country',
                'phone',
                'postal_code',
                'recipient_name'
              ],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-addresses-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/addresses/{id}': {
            delete: {
              description: 'Soft deletes an address by ID. Only owner can delete.',
              parameters: [
                {
                  description: 'Address ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.EmptyResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete address',
              tags: ['Addresses']
            }
          }
        },
        components: {
          schemas: {
            'dto.EmptyResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-addresses-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/addresses/{id}': {
            put: {
              description:
                'Updates an address by its ID. Only owner can update. Supports partial updates.',
              parameters: [
                {
                  description: 'Address ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateAddressRequest'
                    }
                  }
                },
                description:
                  'Fields to update (optional) including address_type (shipping, billing, both)',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.AddressSingleResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update address',
              tags: ['Addresses']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateAddressRequest': {
              properties: {
                address_line1: {
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                address_type: {
                  enum: ['shipping', 'billing', 'both'],
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                instructions: {
                  type: 'string'
                },
                is_default: {
                  type: 'boolean'
                },
                phone: {
                  type: 'string'
                },
                postal_code: {
                  type: 'string'
                },
                recipient_name: {
                  type: 'string'
                },
                state: {
                  type: 'string'
                }
              },
              required: ['address_line1', 'city', 'country', 'postal_code', 'recipient_name'],
              type: 'object'
            },
            'dto.AddressSingleResponse': {
              properties: {
                address: {
                  $ref: '#/components/schemas/models.Address'
                },
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Address': {
              properties: {
                address_line1: {
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                address_type: {
                  enum: ['shipping', 'billing', 'both'],
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                instructions: {
                  type: 'string'
                },
                is_default: {
                  type: 'boolean'
                },
                phone: {
                  type: 'string'
                },
                postal_code: {
                  type: 'string'
                },
                recipient_name: {
                  type: 'string'
                },
                state: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              required: [
                'address_line1',
                'city',
                'country',
                'phone',
                'postal_code',
                'recipient_name'
              ],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-addresses-{id}-default-patch.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/addresses/{id}/default': {
            patch: {
              description:
                'Marks a specific address as the default (for its address_type, e.g., shipping or billing). Only one default per type.',
              parameters: [
                {
                  description: 'Address ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.EmptyResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Set default address',
              tags: ['Addresses']
            }
          }
        },
        components: {
          schemas: {
            'dto.EmptyResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-categories-bulk-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/categories/bulk': {
            delete: {
              description:
                'Deletes multiple categories by their IDs. Only accessible by users with the "admin" role.\nCannot delete categories that have child categories – delete children first.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object'
                    }
                  }
                },
                description: 'Category IDs to delete',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.EmptyResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Bulk delete categories',
              tags: ['Categories']
            }
          }
        },
        components: {
          schemas: {
            'dto.EmptyResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-categories-bulk-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/categories/bulk': {
            post: {
              description:
                'Creates multiple categories at once. Only accessible by users with the "admin" role.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      items: {
                        $ref: '#/components/schemas/dto.CreateCategoryRequest'
                      },
                      type: 'array'
                    }
                  }
                },
                description: 'Array of categories to create',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.BulkCreateCategoryResponse'
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Bulk create categories',
              tags: ['Categories']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateCategoryRequest': {
              properties: {
                description: {
                  type: 'string'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                slug: {
                  type: 'string'
                }
              },
              required: ['name'],
              type: 'object'
            },
            'dto.BulkCreateCategoryResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.BulkCategoryData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.BulkCategoryData': {
              properties: {
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-categories-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/categories/{id}': {
            delete: {
              description:
                'Deletes a category by ID. Only accessible by users with the "admin" role.\nCategories with child categories cannot be deleted – delete children first.',
              parameters: [
                {
                  description: 'Category ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.EmptyResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete a category',
              tags: ['Categories']
            }
          }
        },
        components: {
          schemas: {
            'dto.EmptyResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-categories-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/categories/{id}': {
            get: {
              description:
                'Returns a single category by its numeric ID. Only accessible by users with the "admin" role.',
              parameters: [
                {
                  description: 'Category ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CategorySingleResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get a category by ID (admin)',
              tags: ['Categories']
            }
          }
        },
        components: {
          schemas: {
            'dto.CategorySingleResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CategoryData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CategoryData': {
              properties: {
                category: {
                  $ref: '#/components/schemas/models.Category'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-categories-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/categories/{id}': {
            put: {
              description:
                'Updates an existing category by ID. Only accessible by users with the "admin" role.',
              parameters: [
                {
                  description: 'Category ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateCategoryRequest'
                    }
                  }
                },
                description: 'Category update data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CategorySingleResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update a category',
              tags: ['Categories']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateCategoryRequest': {
              properties: {
                description: {
                  type: 'string'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategorySingleResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CategoryData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CategoryData': {
              properties: {
                category: {
                  $ref: '#/components/schemas/models.Category'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-groups-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/groups': {
            get: {
              description: 'Retrieves all menu groups ordered by display_order',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/models.MenuGroup'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get all menu groups',
              tags: ['Admin Menu Groups']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.MenuGroup': {
              properties: {
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                name: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.MenuItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-groups-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/groups': {
            post: {
              description: 'Creates a menu group (e.g., "Overview", "Users & Access")',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateMenuGroupRequest'
                    }
                  }
                },
                description: 'Group data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.MenuGroup'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create a new menu group',
              tags: ['Admin Menu Groups']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateMenuGroupRequest': {
              properties: {
                display_order: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                }
              },
              required: ['name'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.MenuGroup': {
              properties: {
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                name: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.MenuItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-groups-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/groups/{id}': {
            delete: {
              description: 'Deletes a group and all its menu items (cascade)',
              parameters: [
                {
                  description: 'Group ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete a menu group',
              tags: ['Admin Menu Groups']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-groups-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/groups/{id}': {
            get: {
              description: 'Returns a single menu group by its ID',
              parameters: [
                {
                  description: 'Group ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.MenuGroup'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get group by ID',
              tags: ['Admin Menu Groups']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.MenuGroup': {
              properties: {
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                name: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.MenuItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-groups-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/groups/{id}': {
            put: {
              description: 'Updates group name or display order',
              parameters: [
                {
                  description: 'Group ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateMenuGroupRequest'
                    }
                  }
                },
                description: 'Updated group data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.MenuGroup'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update an existing menu group',
              tags: ['Admin Menu Groups']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateMenuGroupRequest': {
              properties: {
                display_order: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                }
              },
              required: ['name'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.MenuGroup': {
              properties: {
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                name: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.MenuItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-items-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/items': {
            get: {
              description: 'Returns flat or nested menu items (use ?flat=true for flat list)',
              parameters: [
                {
                  description: 'Return flat list',
                  in: 'query',
                  name: 'flat',
                  schema: {
                    default: false,
                    type: 'boolean'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.MenuListResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get all menu items',
              tags: ['Admin Menu Items']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.MenuListResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.MenuItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-items-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/items': {
            post: {
              description: 'Adds a new menu item (can be top-level or child of another item)',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateMenuItemRequest'
                    }
                  }
                },
                description: 'Menu item data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.MenuItem'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create a new menu item',
              tags: ['Admin Menu Items']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateMenuItemRequest': {
              properties: {
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                }
              },
              required: ['group_id', 'icon', 'label'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.MenuItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-items-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/items/{id}': {
            delete: {
              description: 'Deletes a menu item and all its children (cascade)',
              parameters: [
                {
                  description: 'Menu item ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete a menu item',
              tags: ['Admin Menu Items']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-items-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/items/{id}': {
            get: {
              description: 'Returns a single menu item by its ID',
              parameters: [
                {
                  description: 'Item ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.MenuItem'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get menu item by ID',
              tags: ['Admin Menu Items']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.MenuItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-menu-items-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/menu/items/{id}': {
            put: {
              description: 'Updates menu item details including group, parent, label, href, etc.',
              parameters: [
                {
                  description: 'Item ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateMenuItemRequest'
                    }
                  }
                },
                description: 'Updated item data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.MenuItem'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update an existing menu item',
              tags: ['Admin Menu Items']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateMenuItemRequest': {
              properties: {
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                }
              },
              required: ['group_id', 'icon', 'label'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.MenuItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.MenuItem'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-shipments-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/shipments': {
            post: {
              description:
                'Creates a shipment record and triggers a background job to process it (e.g., call carrier API).',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object'
                    }
                  }
                },
                description: 'Shipment data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.Shipment'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create a shipment',
              tags: ['Shipments']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Shipment': {
              properties: {
                address_line1: {
                  description: 'Shipping address',
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                carrier: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                delivered_at: {
                  type: 'string'
                },
                estimated_delivery: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                postal_code: {
                  type: 'string'
                },
                provider: {
                  $ref: '#/components/schemas/models.ShippingProviders'
                },
                provider_id: {
                  type: 'integer'
                },
                shipped_at: {
                  type: 'string'
                },
                shipping_price: {
                  type: 'number'
                },
                state: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                tracking_number: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-shipments-{id}-status-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/shipments/{id}/status': {
            put: {
              description: 'Updates the status of a shipment and sends real-time notifications.',
              parameters: [
                {
                  description: 'Shipment ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object'
                    }
                  }
                },
                description: 'Status update request',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update shipment status (admin)',
              tags: ['Shipments']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-admin-wallet-adjust-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/admin/wallet/adjust': {
            post: {
              description: "Increase or decrease any user's wallet balance. Requires admin role.",
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.AdminAdjustRequest'
                    }
                  }
                },
                description: 'Adjustment data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Admin adjust wallet',
              tags: ['Admin Wallet']
            }
          }
        },
        components: {
          schemas: {
            'dto.AdminAdjustRequest': {
              properties: {
                amount: {
                  type: 'number'
                },
                description: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              required: ['amount', 'description', 'user_id'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-change-password-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/change-password': {
            post: {
              description: "Change current user's password.",
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.ChangePasswordRequest'
                    }
                  }
                },
                description: 'Password change request',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Change password',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'dto.ChangePasswordRequest': {
              properties: {
                current_password: {
                  minLength: 6,
                  type: 'string'
                },
                new_password: {
                  minLength: 6,
                  type: 'string'
                }
              },
              required: ['current_password', 'new_password'],
              type: 'object'
            },
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-forgot-password-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/forgot-password': {
            post: {
              description: 'Sends a password reset email',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.ForgotPasswordRequest'
                    }
                  }
                },
                description: 'Email address',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Bad Request'
                }
              },
              summary: 'Forgot password',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'dto.ForgotPasswordRequest': {
              properties: {
                email: {
                  type: 'string'
                }
              },
              required: ['email'],
              type: 'object'
            },
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-login-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/login': {
            post: {
              description: 'Authenticate and return access & refresh tokens',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.LoginRequest'
                    }
                  }
                },
                description: 'Login credentials',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.LoginResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              summary: 'Login user',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'dto.LoginRequest': {
              properties: {
                email: {
                  type: 'string'
                },
                password: {
                  type: 'string'
                }
              },
              required: ['email', 'password'],
              type: 'object'
            },
            'dto.LoginResponse': {
              properties: {
                data: {
                  $ref: '#/components/schemas/dto.LoginResponseData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.LoginResponseData': {
              properties: {
                access_token: {
                  type: 'string'
                },
                refresh_token: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/dto.UserResponse'
                }
              },
              type: 'object'
            },
            'dto.UserResponse': {
              properties: {
                email: {
                  type: 'string'
                },
                first_name: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                last_name: {
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-logout-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/logout': {
            post: {
              description: 'Invalidate the refresh token (optional specific token)',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object'
                    }
                  }
                },
                description: 'Optional {refresh_token}',
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Logout user',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-refresh-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/refresh': {
            post: {
              description: 'Obtain a new access token using a valid refresh token',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/controllers.RefreshRequest'
                    }
                  }
                },
                description: 'Refresh token',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.RefreshResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Refresh access token',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'controllers.RefreshRequest': {
              properties: {
                refresh_token: {
                  type: 'string'
                }
              },
              required: ['refresh_token'],
              type: 'object'
            },
            'dto.RefreshResponse': {
              properties: {
                data: {
                  $ref: '#/components/schemas/dto.RefreshResponseData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.RefreshResponseData': {
              properties: {
                access_token: {
                  type: 'string'
                },
                refresh_token: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-register-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/register': {
            post: {
              description: 'Create a new account and returns a pair of JWT tokens',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.RegisterRequest'
                    }
                  }
                },
                description: 'Registration data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.RegisterResponse'
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                409: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Conflict'
                }
              },
              summary: 'Register a new user',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'dto.RegisterRequest': {
              properties: {
                email: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                password: {
                  minLength: 8,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name', 'password'],
              type: 'object'
            },
            'dto.RegisterResponse': {
              properties: {
                data: {
                  $ref: '#/components/schemas/dto.RegisterResponseData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.RegisterResponseData': {
              properties: {
                access_token: {
                  type: 'string'
                },
                refresh_token: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/dto.UserResponse'
                }
              },
              type: 'object'
            },
            'dto.UserResponse': {
              properties: {
                email: {
                  type: 'string'
                },
                first_name: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                last_name: {
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-reset-password-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/reset-password': {
            post: {
              description: 'Resets password using a valid token received by email.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.ResetPasswordRequest'
                    }
                  }
                },
                description: 'Reset token and new password',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Bad Request'
                }
              },
              summary: 'Reset password',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'dto.ResetPasswordRequest': {
              properties: {
                new_password: {
                  minLength: 6,
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              },
              required: ['new_password', 'token'],
              type: 'object'
            },
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-send-verification-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/send-verification': {
            post: {
              description: "Sends an email verification link to the authenticated user's email.",
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Send verification email',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-auth-verify-email-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/auth/verify-email': {
            get: {
              description: 'Verifies email address using a token sent via email.',
              parameters: [
                {
                  description: 'Verification token',
                  in: 'query',
                  name: 'token',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.MessageResponse'
                      }
                    }
                  },
                  description: 'Bad Request'
                }
              },
              summary: 'Verify email',
              tags: ['Authentication']
            }
          }
        },
        components: {
          schemas: {
            'dto.MessageResponse': {
              properties: {
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-brands-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/brands': {
            get: {
              description:
                'Returns a paginated list of brands with optional search and status filtering.',
              parameters: [
                {
                  description: 'Page number',
                  in: 'query',
                  name: 'page',
                  schema: {
                    default: 1,
                    type: 'integer'
                  }
                },
                {
                  description: 'Items per page',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    type: 'integer'
                  }
                },
                {
                  description: 'Search by name or slug',
                  in: 'query',
                  name: 'search',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by status',
                  in: 'query',
                  name: 'status',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.BrandResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Brand list'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal server error'
                }
              },
              summary: 'List all brands',
              tags: ['brands']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-brands-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/brands': {
            post: {
              description:
                'Creates a brand with the provided details. Defaults status to "draft" if not supplied.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateBrandRequest'
                    }
                  }
                },
                description: 'Brand creation payload',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.BrandResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Brand created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Validation error'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal server error'
                }
              },
              summary: 'Create a new brand',
              tags: ['brands']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateBrandRequest': {
              properties: {
                description: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-brands-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/brands/{id}': {
            delete: {
              description: 'Permanently deletes a brand by ID.',
              parameters: [
                {
                  description: 'Brand ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Brand deleted'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Invalid ID'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Brand not found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal server error'
                }
              },
              summary: 'Delete a brand',
              tags: ['brands']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-brands-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/brands/{id}': {
            get: {
              description: 'Returns a single brand by its unique identifier.',
              parameters: [
                {
                  description: 'Brand ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.BrandResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Brand found'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Invalid ID'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Brand not found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal server error'
                }
              },
              summary: 'Get a brand by ID',
              tags: ['brands']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-brands-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/brands/{id}': {
            put: {
              description: 'Partially updates a brand. Only supplied fields are changed.',
              parameters: [
                {
                  description: 'Brand ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateBrandRequest'
                    }
                  }
                },
                description: 'Brand update payload',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.BrandResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Brand updated'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Validation error'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Brand not found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal server error'
                }
              },
              summary: 'Update a brand',
              tags: ['brands']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateBrandRequest': {
              properties: {
                description: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-cart-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/cart': {
            get: {
              description: "Retrieve all items in the authenticated user's cart",
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  id: {
                                    type: 'integer'
                                  },
                                  items: {
                                    items: {
                                      $ref: '#/components/schemas/dto.CartItemDetail'
                                    },
                                    type: 'array'
                                  },
                                  total: {
                                    format: 'float64',
                                    type: 'number'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get cart',
              tags: ['Cart']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CartItemDetail': {
              properties: {
                color: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                discount: {
                  type: 'number'
                },
                id: {
                  type: 'integer'
                },
                image: {
                  description: 'New fields',
                  type: 'string'
                },
                is_in_stock: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                original_price: {
                  type: 'number'
                },
                price: {
                  type: 'number'
                },
                product_id: {
                  type: 'integer'
                },
                product_name: {
                  type: 'string'
                },
                quantity: {
                  type: 'integer'
                },
                selected_color: {
                  type: 'string'
                },
                selected_size: {
                  type: 'string'
                },
                size: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                stock: {
                  type: 'integer'
                },
                total: {
                  type: 'number'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-cart-items-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/cart/items': {
            delete: {
              description: 'Delete all items from the active cart',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.EmptyResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Clear cart',
              tags: ['Cart']
            }
          }
        },
        components: {
          schemas: {
            'dto.EmptyResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-cart-items-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/cart/items': {
            post: {
              description: "Add a product to the authenticated user's cart",
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/services.AddItemRequest'
                    }
                  }
                },
                description: 'Add item',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.AddItemResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Add item to cart',
              tags: ['Cart']
            }
          }
        },
        components: {
          schemas: {
            'services.AddItemRequest': {
              properties: {
                color: {
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                quantity: {
                  type: 'integer'
                },
                size: {
                  type: 'string'
                }
              },
              required: ['product_id', 'quantity'],
              type: 'object'
            },
            'dto.AddItemResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CartItemData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CartItemData': {
              properties: {
                id: {
                  type: 'integer'
                },
                price: {
                  type: 'number'
                },
                product_id: {
                  type: 'integer'
                },
                quantity: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-cart-items-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/cart/items/{id}': {
            delete: {
              description: 'Remove a specific item from the cart',
              parameters: [
                {
                  description: 'Cart item ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.EmptyResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Remove cart item',
              tags: ['Cart']
            }
          }
        },
        components: {
          schemas: {
            'dto.EmptyResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-cart-items-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/cart/items/{id}': {
            put: {
              description: 'Change quantity of a specific cart item',
              parameters: [
                {
                  description: 'Cart item ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/services.UpdateCartItemRequest'
                    }
                  }
                },
                description: 'Update quantity',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.EmptyResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update cart item quantity',
              tags: ['Cart']
            }
          }
        },
        components: {
          schemas: {
            'services.UpdateCartItemRequest': {
              properties: {
                color: {
                  type: 'string'
                },
                quantity: {
                  type: 'integer'
                },
                size: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.EmptyResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-categories-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/categories': {
            get: {
              description: 'Returns a paginated list of categories with optional filtering.',
              parameters: [
                {
                  description: 'Items per page',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    maximum: 100,
                    minimum: 1,
                    type: 'integer'
                  }
                },
                {
                  description: 'Offset (skip number of items)',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    minimum: 0,
                    type: 'integer'
                  }
                },
                {
                  description: 'Filter by active status (true/false)',
                  in: 'query',
                  name: 'is_active',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'Filter by parent category ID',
                  in: 'query',
                  name: 'parent_id',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Filter by name  the name ',
                  in: 'query',
                  name: 'search',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Sort order (popular, name)',
                  in: 'query',
                  name: 'sort',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CategoryListResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'List categories',
              tags: ['Categories']
            }
          }
        },
        components: {
          schemas: {
            'dto.CategoryListResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CategoryListData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CategoryListData': {
              properties: {
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                limit: {
                  type: 'integer'
                },
                offset: {
                  type: 'integer'
                },
                total: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-categories-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/categories': {
            post: {
              description:
                'Creates a new product category. Only accessible by users with the "admin" role.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateCategoryRequest'
                    }
                  }
                },
                description: 'Category creation data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CategorySingleResponse'
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create a new category',
              tags: ['Categories']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateCategoryRequest': {
              properties: {
                description: {
                  type: 'string'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                slug: {
                  type: 'string'
                }
              },
              required: ['name'],
              type: 'object'
            },
            'dto.CategorySingleResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CategoryData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CategoryData': {
              properties: {
                category: {
                  $ref: '#/components/schemas/models.Category'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-categories-{identifier}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/categories/{identifier}': {
            get: {
              description: 'Returns a single category. Accepts either a numeric ID or a URL slug.',
              parameters: [
                {
                  description: 'Category ID (numeric) or slug (string)',
                  in: 'path',
                  name: 'identifier',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CategorySingleResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'Get a category by ID or slug',
              tags: ['Categories']
            }
          }
        },
        components: {
          schemas: {
            'dto.CategorySingleResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CategoryData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CategoryData': {
              properties: {
                category: {
                  $ref: '#/components/schemas/models.Category'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-checkout-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/checkout': {
            post: {
              description:
                "Converts the authenticated user's cart into an order, creates pending payment and shipment, and starts background fulfillment.",
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CheckoutRequest'
                    }
                  }
                },
                description: 'Checkout details (address, payment info, optional shipping provider)',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.Order'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Checkout',
              tags: ['Orders']
            }
          }
        },
        components: {
          schemas: {
            'dto.CheckoutRequest': {
              properties: {
                address_line1: {
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                card_last4: {
                  type: 'string'
                },
                card_number: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                coupon_code: {
                  type: 'string'
                },
                cvv: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                },
                expiry_month: {
                  maximum: 12,
                  minimum: 1,
                  type: 'integer'
                },
                expiry_year: {
                  minimum: 2025,
                  type: 'integer'
                },
                first_name: {
                  type: 'string'
                },
                last_name: {
                  type: 'string'
                },
                newsletter: {
                  type: 'boolean'
                },
                payment_method: {
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                save_info: {
                  type: 'boolean'
                },
                shipping_method: {
                  type: 'string'
                },
                shipping_provider_id: {
                  type: 'integer'
                },
                state: {
                  type: 'string'
                },
                zip: {
                  type: 'string'
                }
              },
              required: [
                'address_line1',
                'card_number',
                'city',
                'country',
                'cvv',
                'email',
                'expiry_month',
                'expiry_year',
                'first_name',
                'last_name',
                'phone',
                'state',
                'zip'
              ],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Order': {
              properties: {
                billing_address_id: {
                  description: 'Address IDs (separate addresses table could be added later)',
                  type: 'integer'
                },
                created_at: {
                  type: 'string'
                },
                currency: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.OrderItem'
                  },
                  type: 'array'
                },
                notes: {
                  type: 'string'
                },
                order_number: {
                  type: 'string'
                },
                payment: {
                  $ref: '#/components/schemas/models.Payment'
                },
                payment_id: {
                  type: 'integer'
                },
                shipment: {
                  $ref: '#/components/schemas/models.Shipment'
                },
                shipment_id: {
                  type: 'integer'
                },
                shipping_address_id: {
                  type: 'integer'
                },
                status: {
                  type: 'string'
                },
                total_amount: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.OrderItem': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                price: {
                  type: 'number'
                },
                product: {
                  $ref: '#/components/schemas/models.Product'
                },
                product_id: {
                  type: 'integer'
                },
                quantity: {
                  type: 'integer'
                },
                total: {
                  description: 'read-only',
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Payment': {
              properties: {
                amount: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                currency: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                gateway_response: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                method: {
                  type: 'string'
                },
                order_id: {
                  type: 'integer'
                },
                status: {
                  type: 'string'
                },
                transaction_id: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Shipment': {
              properties: {
                address_line1: {
                  description: 'Shipping address',
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                carrier: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                delivered_at: {
                  type: 'string'
                },
                estimated_delivery: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                postal_code: {
                  type: 'string'
                },
                provider: {
                  $ref: '#/components/schemas/models.ShippingProviders'
                },
                provider_id: {
                  type: 'integer'
                },
                shipped_at: {
                  type: 'string'
                },
                shipping_price: {
                  type: 'number'
                },
                state: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                tracking_number: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-compare-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/compare': {
            get: {
              description:
                'Returns the list of product IDs in the compare list (authenticated or guest via session_id)',
              parameters: [
                {
                  description: 'Session ID for guest users',
                  in: 'query',
                  name: 'session_id',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.CompareListResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  'BearerAuth (optional)': []
                }
              ],
              summary: "Get user's compare list",
              tags: ['Compare']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CompareListResponse': {
              properties: {
                product_ids: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-compare-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/compare': {
            post: {
              description: 'Get product details for comparison (2–4 products)',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CompareRequest'
                    }
                  }
                },
                description: 'Product IDs',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.CompareProductResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              summary: 'Compare products',
              tags: ['Compare']
            }
          }
        },
        components: {
          schemas: {
            'dto.CompareRequest': {
              properties: {
                product_ids: {
                  items: {
                    type: 'integer'
                  },
                  maxItems: 4,
                  minItems: 2,
                  type: 'array'
                }
              },
              required: ['product_ids'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CompareProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                discount_percent: {
                  type: 'number'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                return_policy: {
                  type: 'string'
                },
                reviews_count: {
                  type: 'integer'
                },
                shipping_info: {
                  type: 'string'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                store_logo: {
                  type: 'string'
                },
                store_name: {
                  type: 'string'
                },
                store_slug: {
                  type: 'string'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-compare-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/compare': {
            put: {
              description: "Save the user's compare list (replaces existing)",
              parameters: [
                {
                  description: 'Session ID for guest users',
                  in: 'query',
                  name: 'session_id',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.SyncCompareRequest'
                    }
                  }
                },
                description: 'Product IDs',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                }
              },
              security: [
                {
                  'BearerAuth (optional)': []
                }
              ],
              summary: 'Sync compare list',
              tags: ['Compare']
            }
          }
        },
        components: {
          schemas: {
            'dto.SyncCompareRequest': {
              properties: {
                product_ids: {
                  items: {
                    type: 'integer'
                  },
                  maxItems: 4,
                  type: 'array'
                }
              },
              required: ['product_ids'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-coupons-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/coupons': {
            get: {
              description: 'Returns a paginated list of coupons with optional filters (admin only)',
              parameters: [
                {
                  description: 'Items per page',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    maximum: 100,
                    minimum: 1,
                    type: 'integer'
                  }
                },
                {
                  description: 'Offset (skip number of items)',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    minimum: 0,
                    type: 'integer'
                  }
                },
                {
                  description: 'Filter by coupon code (partial match)',
                  in: 'query',
                  name: 'code',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by active status',
                  in: 'query',
                  name: 'is_active',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'Filter by discount type (percentage/fixed)',
                  in: 'query',
                  name: 'discount_type',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by start date (ISO 8601)',
                  in: 'query',
                  name: 'start_date',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by end date (ISO 8601)',
                  in: 'query',
                  name: 'end_date',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CouponListResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'List coupons',
              tags: ['Coupons']
            }
          }
        },
        components: {
          schemas: {
            'dto.CouponListResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CouponListData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CouponListData': {
              properties: {
                coupons: {
                  items: {
                    $ref: '#/components/schemas/models.Coupon'
                  },
                  type: 'array'
                },
                limit: {
                  type: 'integer'
                },
                offset: {
                  type: 'integer'
                },
                total: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Coupon': {
              properties: {
                code: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                discount_type: {
                  enum: ['percentage', 'fixed'],
                  type: 'string'
                },
                discount_value: {
                  type: 'number'
                },
                end_date: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                max_discount_amount: {
                  type: 'number'
                },
                minimum_order_amount: {
                  type: 'number'
                },
                start_date: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                usage_limit: {
                  type: 'integer'
                },
                used_count: {
                  type: 'integer'
                }
              },
              required: ['code'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-coupons-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/coupons': {
            post: {
              description:
                'Creates a new discount coupon. Only accessible by users with the "admin" role.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateCouponRequest'
                    }
                  }
                },
                description: 'Coupon creation data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CouponSingleResponse'
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                409: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Conflict'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create coupon',
              tags: ['Coupons']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateCouponRequest': {
              properties: {
                code: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                discount_type: {
                  enum: ['percentage', 'fixed'],
                  type: 'string'
                },
                discount_value: {
                  type: 'number'
                },
                end_date: {
                  type: 'string'
                },
                max_discount_amount: {
                  type: 'number'
                },
                minimum_order_amount: {
                  type: 'number'
                },
                start_date: {
                  type: 'string'
                },
                usage_limit: {
                  type: 'integer'
                }
              },
              required: ['code', 'discount_type', 'discount_value', 'end_date', 'start_date'],
              type: 'object'
            },
            'dto.CouponSingleResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CouponData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CouponData': {
              properties: {
                coupon: {
                  $ref: '#/components/schemas/models.Coupon'
                }
              },
              type: 'object'
            },
            'models.Coupon': {
              properties: {
                code: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                discount_type: {
                  enum: ['percentage', 'fixed'],
                  type: 'string'
                },
                discount_value: {
                  type: 'number'
                },
                end_date: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                max_discount_amount: {
                  type: 'number'
                },
                minimum_order_amount: {
                  type: 'number'
                },
                start_date: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                usage_limit: {
                  type: 'integer'
                },
                used_count: {
                  type: 'integer'
                }
              },
              required: ['code'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-coupons-my-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/coupons/my': {
            get: {
              description:
                'Retrieve all coupons that are valid and not yet used by the authenticated user',
              parameters: [
                {
                  description: 'Order total amount to filter by minimum order requirement',
                  in: 'query',
                  name: 'order_total',
                  schema: {
                    type: 'number'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/models.Coupon'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get my available coupons',
              tags: ['Coupons']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Coupon': {
              properties: {
                code: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                discount_type: {
                  enum: ['percentage', 'fixed'],
                  type: 'string'
                },
                discount_value: {
                  type: 'number'
                },
                end_date: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                max_discount_amount: {
                  type: 'number'
                },
                minimum_order_amount: {
                  type: 'number'
                },
                start_date: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                usage_limit: {
                  type: 'integer'
                },
                used_count: {
                  type: 'integer'
                }
              },
              required: ['code'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-coupons-validate-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/coupons/validate': {
            post: {
              description:
                "Validates a coupon code for the authenticated user's order total. Returns discount amount and final total if valid.",
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.ValidateRequest'
                    }
                  }
                },
                description: 'Coupon validation request',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CouponValidateResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Validate coupon',
              tags: ['Coupons']
            }
          }
        },
        components: {
          schemas: {
            'dto.ValidateRequest': {
              properties: {
                code: {
                  type: 'string'
                },
                order_total: {
                  type: 'number'
                }
              },
              required: ['code', 'order_total'],
              type: 'object'
            },
            'dto.CouponValidateResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CouponValidateData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CouponValidateData': {
              properties: {
                coupon: {
                  $ref: '#/components/schemas/models.Coupon'
                },
                discount_amount: {
                  type: 'number'
                },
                final_total: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'models.Coupon': {
              properties: {
                code: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                discount_type: {
                  enum: ['percentage', 'fixed'],
                  type: 'string'
                },
                discount_value: {
                  type: 'number'
                },
                end_date: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                max_discount_amount: {
                  type: 'number'
                },
                minimum_order_amount: {
                  type: 'number'
                },
                start_date: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                usage_limit: {
                  type: 'integer'
                },
                used_count: {
                  type: 'integer'
                }
              },
              required: ['code'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-coupons-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/coupons/{id}': {
            delete: {
              description:
                'Soft-deletes a coupon by ID. Only accessible by users with the "admin" role.',
              parameters: [
                {
                  description: 'Coupon ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.EmptyResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete coupon',
              tags: ['Coupons']
            }
          }
        },
        components: {
          schemas: {
            'dto.EmptyResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-coupons-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/coupons/{id}': {
            get: {
              description:
                'Returns a single coupon by its numeric ID. Only accessible by users with the "admin" role.',
              parameters: [
                {
                  description: 'Coupon ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CouponSingleResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get a coupon by ID',
              tags: ['Coupons']
            }
          }
        },
        components: {
          schemas: {
            'dto.CouponSingleResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CouponData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CouponData': {
              properties: {
                coupon: {
                  $ref: '#/components/schemas/models.Coupon'
                }
              },
              type: 'object'
            },
            'models.Coupon': {
              properties: {
                code: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                discount_type: {
                  enum: ['percentage', 'fixed'],
                  type: 'string'
                },
                discount_value: {
                  type: 'number'
                },
                end_date: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                max_discount_amount: {
                  type: 'number'
                },
                minimum_order_amount: {
                  type: 'number'
                },
                start_date: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                usage_limit: {
                  type: 'integer'
                },
                used_count: {
                  type: 'integer'
                }
              },
              required: ['code'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-coupons-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/coupons/{id}': {
            put: {
              description:
                'Updates a coupon by ID. Only accessible by users with the "admin" role.',
              parameters: [
                {
                  description: 'Coupon ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateCouponRequest'
                    }
                  }
                },
                description: 'Coupon update data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/dto.CouponSingleResponse'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                409: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Conflict'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update coupon',
              tags: ['Coupons']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateCouponRequest': {
              properties: {
                code: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                discount_type: {
                  type: 'string'
                },
                discount_value: {
                  type: 'number'
                },
                end_date: {
                  type: 'string'
                },
                is_active: {
                  type: 'boolean'
                },
                max_discount_amount: {
                  type: 'number'
                },
                minimum_order_amount: {
                  type: 'number'
                },
                start_date: {
                  type: 'string'
                },
                usage_limit: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'dto.CouponSingleResponse': {
              properties: {
                code: {
                  type: 'integer'
                },
                data: {
                  $ref: '#/components/schemas/dto.CouponData'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.CouponData': {
              properties: {
                coupon: {
                  $ref: '#/components/schemas/models.Coupon'
                }
              },
              type: 'object'
            },
            'models.Coupon': {
              properties: {
                code: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                discount_type: {
                  enum: ['percentage', 'fixed'],
                  type: 'string'
                },
                discount_value: {
                  type: 'number'
                },
                end_date: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                max_discount_amount: {
                  type: 'number'
                },
                minimum_order_amount: {
                  type: 'number'
                },
                start_date: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                usage_limit: {
                  type: 'integer'
                },
                used_count: {
                  type: 'integer'
                }
              },
              required: ['code'],
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-health-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/health': {
            get: {
              description: 'Returns the health status of the API and database',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        additionalProperties: true,
                        type: 'object'
                      }
                    }
                  },
                  description: 'OK'
                },
                503: {
                  content: {
                    'application/json': {
                      schema: {
                        additionalProperties: true,
                        type: 'object'
                      }
                    }
                  },
                  description: 'Service Unavailable'
                }
              },
              summary: 'Health check',
              tags: ['health']
            }
          }
        },
        components: {
          schemas: {}
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-nav-menus-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/nav-menus': {
            get: {
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.NavItemResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              summary: 'Get all navigation menus',
              tags: ['Navigation']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.NavItemResponse': {
              properties: {
                badge: {
                  type: 'string'
                },
                columns: {
                  items: {
                    $ref: '#/components/schemas/dto.Column'
                  },
                  type: 'array'
                },
                featured: {
                  items: {
                    $ref: '#/components/schemas/dto.FeaturedItem'
                  },
                  type: 'array'
                },
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                },
                type: {
                  type: 'string'
                },
                viewAll: {
                  $ref: '#/components/schemas/dto.ViewAll'
                }
              },
              type: 'object'
            },
            'dto.Column': {
              properties: {
                links: {
                  items: {
                    $ref: '#/components/schemas/dto.Link'
                  },
                  type: 'array'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.Link': {
              properties: {
                href: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.FeaturedItem': {
              properties: {
                badge: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                href: {
                  type: 'string'
                },
                image: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.ViewAll': {
              properties: {
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-nav-menus-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/nav-menus': {
            post: {
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpsertNavMenuRequest'
                    }
                  }
                },
                description: 'Menu data',
                required: true,
                'x-originalParamName': 'body'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.NavItemResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                }
              },
              summary: 'Create navigation menu',
              tags: ['Navigation']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpsertNavMenuRequest': {
              properties: {
                badge: {
                  type: 'string'
                },
                columns: {
                  items: {
                    $ref: '#/components/schemas/dto.Column'
                  },
                  type: 'array'
                },
                featured: {
                  items: {
                    $ref: '#/components/schemas/dto.FeaturedItem'
                  },
                  type: 'array'
                },
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                },
                order: {
                  type: 'integer'
                },
                type: {
                  enum: ['mega', 'link'],
                  type: 'string'
                },
                viewAll: {
                  $ref: '#/components/schemas/dto.ViewAll'
                }
              },
              required: ['label', 'type'],
              type: 'object'
            },
            'dto.Column': {
              properties: {
                links: {
                  items: {
                    $ref: '#/components/schemas/dto.Link'
                  },
                  type: 'array'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.Link': {
              properties: {
                href: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.FeaturedItem': {
              properties: {
                badge: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                href: {
                  type: 'string'
                },
                image: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.ViewAll': {
              properties: {
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.NavItemResponse': {
              properties: {
                badge: {
                  type: 'string'
                },
                columns: {
                  items: {
                    $ref: '#/components/schemas/dto.Column'
                  },
                  type: 'array'
                },
                featured: {
                  items: {
                    $ref: '#/components/schemas/dto.FeaturedItem'
                  },
                  type: 'array'
                },
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                },
                type: {
                  type: 'string'
                },
                viewAll: {
                  $ref: '#/components/schemas/dto.ViewAll'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-nav-menus-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/nav-menus/{id}': {
            delete: {
              parameters: [
                {
                  description: 'Menu ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              summary: 'Delete navigation menu',
              tags: ['Navigation']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-nav-menus-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/nav-menus/{id}': {
            get: {
              parameters: [
                {
                  description: 'Menu ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.NavItemResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              summary: 'Get one navigation menu',
              tags: ['Navigation']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.NavItemResponse': {
              properties: {
                badge: {
                  type: 'string'
                },
                columns: {
                  items: {
                    $ref: '#/components/schemas/dto.Column'
                  },
                  type: 'array'
                },
                featured: {
                  items: {
                    $ref: '#/components/schemas/dto.FeaturedItem'
                  },
                  type: 'array'
                },
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                },
                type: {
                  type: 'string'
                },
                viewAll: {
                  $ref: '#/components/schemas/dto.ViewAll'
                }
              },
              type: 'object'
            },
            'dto.Column': {
              properties: {
                links: {
                  items: {
                    $ref: '#/components/schemas/dto.Link'
                  },
                  type: 'array'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.Link': {
              properties: {
                href: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.FeaturedItem': {
              properties: {
                badge: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                href: {
                  type: 'string'
                },
                image: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.ViewAll': {
              properties: {
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-nav-menus-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/nav-menus/{id}': {
            put: {
              parameters: [
                {
                  description: 'Menu ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpsertNavMenuRequest'
                    }
                  }
                },
                description: 'Menu data',
                required: true,
                'x-originalParamName': 'body'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.NavItemResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              summary: 'Update navigation menu',
              tags: ['Navigation']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpsertNavMenuRequest': {
              properties: {
                badge: {
                  type: 'string'
                },
                columns: {
                  items: {
                    $ref: '#/components/schemas/dto.Column'
                  },
                  type: 'array'
                },
                featured: {
                  items: {
                    $ref: '#/components/schemas/dto.FeaturedItem'
                  },
                  type: 'array'
                },
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                },
                order: {
                  type: 'integer'
                },
                type: {
                  enum: ['mega', 'link'],
                  type: 'string'
                },
                viewAll: {
                  $ref: '#/components/schemas/dto.ViewAll'
                }
              },
              required: ['label', 'type'],
              type: 'object'
            },
            'dto.Column': {
              properties: {
                links: {
                  items: {
                    $ref: '#/components/schemas/dto.Link'
                  },
                  type: 'array'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.Link': {
              properties: {
                href: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.FeaturedItem': {
              properties: {
                badge: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                href: {
                  type: 'string'
                },
                image: {
                  type: 'string'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.ViewAll': {
              properties: {
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.NavItemResponse': {
              properties: {
                badge: {
                  type: 'string'
                },
                columns: {
                  items: {
                    $ref: '#/components/schemas/dto.Column'
                  },
                  type: 'array'
                },
                featured: {
                  items: {
                    $ref: '#/components/schemas/dto.FeaturedItem'
                  },
                  type: 'array'
                },
                href: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                },
                type: {
                  type: 'string'
                },
                viewAll: {
                  $ref: '#/components/schemas/dto.ViewAll'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-orders-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/orders': {
            get: {
              description:
                'Returns paginated list of all orders with filtering by status, date, amount, and user ID.',
              parameters: [
                {
                  description: 'Items per page',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    type: 'integer'
                  }
                },
                {
                  description: 'Offset',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    type: 'integer'
                  }
                },
                {
                  description: 'Order status',
                  in: 'query',
                  name: 'status',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Start date (RFC3339)',
                  in: 'query',
                  name: 'from_date',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'End date (RFC3339)',
                  in: 'query',
                  name: 'to_date',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Minimum amount',
                  in: 'query',
                  name: 'min_amount',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Maximum amount',
                  in: 'query',
                  name: 'max_amount',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Filter by user ID',
                  in: 'query',
                  name: 'user_id',
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  limit: {
                                    type: 'integer'
                                  },
                                  offset: {
                                    type: 'integer'
                                  },
                                  orders: {
                                    items: {
                                      $ref: '#/components/schemas/models.Order'
                                    },
                                    type: 'array'
                                  },
                                  total: {
                                    type: 'integer'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'List all orders (admin)',
              tags: ['Orders']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Order': {
              properties: {
                billing_address_id: {
                  description: 'Address IDs (separate addresses table could be added later)',
                  type: 'integer'
                },
                created_at: {
                  type: 'string'
                },
                currency: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.OrderItem'
                  },
                  type: 'array'
                },
                notes: {
                  type: 'string'
                },
                order_number: {
                  type: 'string'
                },
                payment: {
                  $ref: '#/components/schemas/models.Payment'
                },
                payment_id: {
                  type: 'integer'
                },
                shipment: {
                  $ref: '#/components/schemas/models.Shipment'
                },
                shipment_id: {
                  type: 'integer'
                },
                shipping_address_id: {
                  type: 'integer'
                },
                status: {
                  type: 'string'
                },
                total_amount: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.OrderItem': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                price: {
                  type: 'number'
                },
                product: {
                  $ref: '#/components/schemas/models.Product'
                },
                product_id: {
                  type: 'integer'
                },
                quantity: {
                  type: 'integer'
                },
                total: {
                  description: 'read-only',
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Payment': {
              properties: {
                amount: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                currency: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                gateway_response: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                method: {
                  type: 'string'
                },
                order_id: {
                  type: 'integer'
                },
                status: {
                  type: 'string'
                },
                transaction_id: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Shipment': {
              properties: {
                address_line1: {
                  description: 'Shipping address',
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                carrier: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                delivered_at: {
                  type: 'string'
                },
                estimated_delivery: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                postal_code: {
                  type: 'string'
                },
                provider: {
                  $ref: '#/components/schemas/models.ShippingProviders'
                },
                provider_id: {
                  type: 'integer'
                },
                shipped_at: {
                  type: 'string'
                },
                shipping_price: {
                  type: 'number'
                },
                state: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                tracking_number: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-orders-my-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/orders/my': {
            get: {
              description: 'Returns all orders for the authenticated user (paginated).',
              parameters: [
                {
                  description: 'Items per page',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    type: 'integer'
                  }
                },
                {
                  description: 'Offset (begin)',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  limit: {
                                    type: 'integer'
                                  },
                                  offset: {
                                    type: 'integer'
                                  },
                                  orders: {
                                    items: {
                                      $ref: '#/components/schemas/models.Order'
                                    },
                                    type: 'array'
                                  },
                                  total: {
                                    type: 'integer'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: "Get user's orders",
              tags: ['Orders']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Order': {
              properties: {
                billing_address_id: {
                  description: 'Address IDs (separate addresses table could be added later)',
                  type: 'integer'
                },
                created_at: {
                  type: 'string'
                },
                currency: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.OrderItem'
                  },
                  type: 'array'
                },
                notes: {
                  type: 'string'
                },
                order_number: {
                  type: 'string'
                },
                payment: {
                  $ref: '#/components/schemas/models.Payment'
                },
                payment_id: {
                  type: 'integer'
                },
                shipment: {
                  $ref: '#/components/schemas/models.Shipment'
                },
                shipment_id: {
                  type: 'integer'
                },
                shipping_address_id: {
                  type: 'integer'
                },
                status: {
                  type: 'string'
                },
                total_amount: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.OrderItem': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                price: {
                  type: 'number'
                },
                product: {
                  $ref: '#/components/schemas/models.Product'
                },
                product_id: {
                  type: 'integer'
                },
                quantity: {
                  type: 'integer'
                },
                total: {
                  description: 'read-only',
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Payment': {
              properties: {
                amount: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                currency: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                gateway_response: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                method: {
                  type: 'string'
                },
                order_id: {
                  type: 'integer'
                },
                status: {
                  type: 'string'
                },
                transaction_id: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Shipment': {
              properties: {
                address_line1: {
                  description: 'Shipping address',
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                carrier: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                delivered_at: {
                  type: 'string'
                },
                estimated_delivery: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                postal_code: {
                  type: 'string'
                },
                provider: {
                  $ref: '#/components/schemas/models.ShippingProviders'
                },
                provider_id: {
                  type: 'integer'
                },
                shipped_at: {
                  type: 'string'
                },
                shipping_price: {
                  type: 'number'
                },
                state: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                tracking_number: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-orders-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/orders/{id}': {
            get: {
              description: 'Returns a single order for the authenticated user.',
              parameters: [
                {
                  description: 'Order ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.Order'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get order by ID',
              tags: ['Orders']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Order': {
              properties: {
                billing_address_id: {
                  description: 'Address IDs (separate addresses table could be added later)',
                  type: 'integer'
                },
                created_at: {
                  type: 'string'
                },
                currency: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/models.OrderItem'
                  },
                  type: 'array'
                },
                notes: {
                  type: 'string'
                },
                order_number: {
                  type: 'string'
                },
                payment: {
                  $ref: '#/components/schemas/models.Payment'
                },
                payment_id: {
                  type: 'integer'
                },
                shipment: {
                  $ref: '#/components/schemas/models.Shipment'
                },
                shipment_id: {
                  type: 'integer'
                },
                shipping_address_id: {
                  type: 'integer'
                },
                status: {
                  type: 'string'
                },
                total_amount: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.OrderItem': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                price: {
                  type: 'number'
                },
                product: {
                  $ref: '#/components/schemas/models.Product'
                },
                product_id: {
                  type: 'integer'
                },
                quantity: {
                  type: 'integer'
                },
                total: {
                  description: 'read-only',
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Product': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/models.ProductAttribute'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/models.Brand'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/models.Category'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                created_by: {
                  type: 'integer'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 2,
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  enum: ['active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  description: 'Inventory extras',
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                updated_by: {
                  type: 'integer'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku', 'slug'],
              type: 'object'
            },
            'models.ProductAttribute': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                updated_at: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'models.Brand': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'models.Category': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  maxLength: 100,
                  minLength: 2,
                  type: 'string'
                },
                parent: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.Category'
                    }
                  ],
                  description: 'Associations'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                slug: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['name', 'slug'],
              type: 'object'
            },
            'models.Store': {
              properties: {
                bannerURL: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/models.Category'
                  },
                  type: 'array'
                },
                createdAt: {
                  type: 'string'
                },
                deletedAt: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                description: {
                  type: 'string'
                },
                followerCount: {
                  type: 'integer'
                },
                followers: {
                  items: {
                    $ref: '#/components/schemas/models.User'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                isVerified: {
                  type: 'boolean'
                },
                joinedAt: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logoURL: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/models.Product'
                  },
                  type: 'array'
                },
                rating: {
                  type: 'number'
                },
                returnPolicy: {
                  type: 'string'
                },
                reviewCount: {
                  type: 'integer'
                },
                reviews: {
                  items: {
                    $ref: '#/components/schemas/models.StoreReview'
                  },
                  type: 'array'
                },
                settings: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                shippingInfo: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  allOf: [
                    {
                      $ref: '#/components/schemas/models.User'
                    }
                  ],
                  description: 'Relationships'
                },
                userID: {
                  description: 'owner (admin user)',
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.User': {
              properties: {
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                email: {
                  description: 'Account identity',
                  type: 'string'
                },
                email_verified_at: {
                  type: 'string'
                },
                first_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                id: {
                  description: 'Primary',
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                last_login_at: {
                  description: 'Audit',
                  type: 'string'
                },
                last_name: {
                  maxLength: 100,
                  minLength: 1,
                  type: 'string'
                },
                phone: {
                  type: 'string'
                },
                role: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              required: ['email', 'first_name', 'last_name'],
              type: 'object'
            },
            'models.StoreReview': {
              properties: {
                comment: {
                  type: 'string'
                },
                createdAt: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                store: {
                  $ref: '#/components/schemas/models.Store'
                },
                storeID: {
                  type: 'integer'
                },
                updatedAt: {
                  type: 'string'
                },
                user: {
                  $ref: '#/components/schemas/models.User'
                },
                userID: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Payment': {
              properties: {
                amount: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                currency: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                gateway_response: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                id: {
                  type: 'integer'
                },
                method: {
                  type: 'string'
                },
                order_id: {
                  type: 'integer'
                },
                status: {
                  type: 'string'
                },
                transaction_id: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.Shipment': {
              properties: {
                address_line1: {
                  description: 'Shipping address',
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                carrier: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                delivered_at: {
                  type: 'string'
                },
                estimated_delivery: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                postal_code: {
                  type: 'string'
                },
                provider: {
                  $ref: '#/components/schemas/models.ShippingProviders'
                },
                provider_id: {
                  type: 'integer'
                },
                shipped_at: {
                  type: 'string'
                },
                shipping_price: {
                  type: 'number'
                },
                state: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                tracking_number: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-orders-{id}-status-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/orders/{id}/status': {
            put: {
              description: 'Updates the status of an order and sends real-time notifications.',
              parameters: [
                {
                  description: 'Order ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object'
                    }
                  }
                },
                description: 'Status update request',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update order status (admin)',
              tags: ['Orders']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-payment-providers-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/payment-providers': {
            get: {
              description:
                'Returns a list of available payment providers, optionally filtering by active status.',
              parameters: [
                {
                  description: 'Filter by active status (default: true)',
                  in: 'query',
                  name: 'is_active',
                  schema: {
                    type: 'boolean'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.PaymentProviderResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'List of payment providers'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Failed to fetch payment providers'
                }
              },
              summary: 'Get payment providers',
              tags: ['Payment']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.PaymentProviderResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                display_name: {
                  type: 'string'
                },
                icon_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                requires_card: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products': {
            get: {
              description: 'Get products with pagination and optional filters',
              parameters: [
                {
                  description: 'Items per page (default 20, max 100)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    type: 'integer'
                  }
                },
                {
                  description: 'Number of items to skip',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    type: 'integer'
                  }
                },
                {
                  description: 'Product status',
                  in: 'query',
                  name: 'status',
                  schema: {
                    enum: ['active', 'draft', 'archived'],
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by product name',
                  in: 'query',
                  name: 'name',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by SKU',
                  in: 'query',
                  name: 'sku',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by category ID',
                  in: 'query',
                  name: 'category_id',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Filter by brand ID',
                  in: 'query',
                  name: 'brand_id',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Minimum price',
                  in: 'query',
                  name: 'min_price',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Maximum price',
                  in: 'query',
                  name: 'max_price',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Minimum rating (0–5)',
                  in: 'query',
                  name: 'min_rating',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Maximum rating',
                  in: 'query',
                  name: 'max_rating',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Minimum review count',
                  in: 'query',
                  name: 'min_reviews',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Maximum review count',
                  in: 'query',
                  name: 'max_reviews',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Digital products only',
                  in: 'query',
                  name: 'is_digital',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'New products only',
                  in: 'query',
                  name: 'is_new',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'Sort order',
                  in: 'query',
                  name: 'sort',
                  schema: {
                    enum: [
                      'rating_desc',
                      'rating_asc',
                      'newest',
                      'reviews_desc',
                      'price_asc',
                      'price_desc'
                    ],
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  limit: {
                                    type: 'integer'
                                  },
                                  offset: {
                                    type: 'integer'
                                  },
                                  products: {
                                    items: {
                                      $ref: '#/components/schemas/dto.ProductWithLike'
                                    },
                                    type: 'array'
                                  },
                                  total: {
                                    type: 'integer'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'List products',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ProductWithLike': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_liked: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products': {
            post: {
              description: 'Add a new product to the catalog',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateProductRequest'
                    }
                  }
                },
                description: 'Product details',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.ProductResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                409: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Conflict'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create product',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateProductRequest': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeInput'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand_id: {
                  type: 'integer'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  minimum: 0,
                  type: 'number'
                },
                cost: {
                  minimum: 0,
                  type: 'number'
                },
                description: {
                  type: 'string'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 3,
                  type: 'string'
                },
                price: {
                  minimum: 0,
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                status: {
                  enum: ['draft', 'active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store_id: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                visibility: {
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  minimum: 0,
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku'],
              type: 'object'
            },
            'dto.ProductAttributeInput': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-bulk-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/bulk': {
            delete: {
              description: 'Soft delete multiple products by their IDs (admin only)',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.BulkDeleteProductsRequest'
                    }
                  }
                },
                description: 'Product IDs to delete',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Bulk delete products',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'dto.BulkDeleteProductsRequest': {
              properties: {
                product_ids: {
                  items: {
                    type: 'integer'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['product_ids'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-bulk-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/bulk': {
            post: {
              description: 'Create multiple products in a single request (admin only)',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      items: {
                        $ref: '#/components/schemas/dto.CreateProductRequest'
                      },
                      type: 'array'
                    }
                  }
                },
                description: 'Array of products',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.ProductResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Bulk create products',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateProductRequest': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeInput'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand_id: {
                  type: 'integer'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  minimum: 0,
                  type: 'number'
                },
                cost: {
                  minimum: 0,
                  type: 'number'
                },
                description: {
                  type: 'string'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 3,
                  type: 'string'
                },
                price: {
                  minimum: 0,
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                status: {
                  enum: ['draft', 'active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store_id: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                visibility: {
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  minimum: 0,
                  type: 'number'
                }
              },
              required: ['name', 'price', 'sku'],
              type: 'object'
            },
            'dto.ProductAttributeInput': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-suggestions-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/suggestions': {
            post: {
              description:
                'Returns products from the same categories as the provided product IDs, excluding the products themselves. Useful for cart page "you might also like".',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.SuggestionsRequest'
                    }
                  }
                },
                description: 'Product IDs and limit',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.ProductResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Suggestions fetched'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Invalid request'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get smart product suggestions',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'dto.SuggestionsRequest': {
              properties: {
                limit: {
                  maximum: 20,
                  minimum: 1,
                  type: 'integer'
                },
                product_ids: {
                  items: {
                    type: 'integer'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['product_ids'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/{id}': {
            delete: {
              description: 'Soft delete a product by its ID',
              parameters: [
                {
                  description: 'Product ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete product',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/{id}': {
            get: {
              description: 'Fetch a single product using either its numeric ID or slug',
              parameters: [
                {
                  description: 'Product identifier (ID or slug)',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  is_liked: {
                                    type: 'boolean'
                                  },
                                  product: {
                                    $ref: '#/components/schemas/dto.ProductResponse'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'Get product by ID or slug',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/{id}': {
            put: {
              description: 'Update an existing product by its ID',
              parameters: [
                {
                  description: 'Product ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateProductRequest'
                    }
                  }
                },
                description: 'Product update data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.ProductResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                409: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Conflict'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update product',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateProductRequest': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeInput'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand_id: {
                  type: 'integer'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  minimum: 0,
                  type: 'number'
                },
                cost: {
                  minimum: 0,
                  type: 'number'
                },
                description: {
                  type: 'string'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  maxLength: 255,
                  minLength: 3,
                  type: 'string'
                },
                price: {
                  minimum: 0,
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  maxLength: 50,
                  minLength: 3,
                  type: 'string'
                },
                status: {
                  enum: ['draft', 'active', 'inactive', 'archived'],
                  type: 'string'
                },
                stock: {
                  minimum: 0,
                  type: 'integer'
                },
                store_id: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                visibility: {
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  minimum: 0,
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeInput': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                  type: 'array'
                }
              },
              required: ['name', 'values'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-{id}-like-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/{id}/like': {
            post: {
              description:
                'Like or unlike a product. Send `{"like": true}` to like, `{"like": false}` to unlike.',
              parameters: [
                {
                  description: 'Product ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.ToggleLikeRequest'
                    }
                  }
                },
                description: 'Toggle action',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.ToggleLikeResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Toggle product like',
              tags: ['Product Likes']
            }
          }
        },
        components: {
          schemas: {
            'dto.ToggleLikeRequest': {
              properties: {
                like: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ToggleLikeResponse': {
              properties: {
                liked: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-{id}-liked-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/{id}/liked': {
            get: {
              description: 'Returns whether the authenticated user has liked the given product.',
              parameters: [
                {
                  description: 'Product ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  liked: {
                                    type: 'boolean'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Check if product is liked',
              tags: ['Product Likes']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-products-{id}-related-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/products/{id}/related': {
            get: {
              description:
                'Fetch products from the same category, ordered by rating and review count',
              parameters: [
                {
                  description: 'Product ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Number of related products (default 4, max 10)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.ProductResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'Get related products',
              tags: ['Products']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-profile-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/profile': {
            get: {
              description:
                'Returns the profile of the currently authenticated user including default addresses',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  created_at: {
                                    type: 'string'
                                  },
                                  default_billing_address: {
                                    type: 'object'
                                  },
                                  default_shipping_address: {
                                    type: 'object'
                                  },
                                  email: {
                                    type: 'string'
                                  },
                                  first_name: {
                                    type: 'string'
                                  },
                                  id: {
                                    type: 'integer'
                                  },
                                  is_active: {
                                    type: 'boolean'
                                  },
                                  last_name: {
                                    type: 'string'
                                  },
                                  phone: {
                                    type: 'string'
                                  },
                                  role: {
                                    type: 'string'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get user profile',
              tags: ['User']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-profile-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/profile': {
            put: {
              description:
                'Updates the first name, last name, and phone number of the authenticated user',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object'
                    }
                  }
                },
                description: 'Profile update data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  email: {
                                    type: 'string'
                                  },
                                  first_name: {
                                    type: 'string'
                                  },
                                  id: {
                                    type: 'integer'
                                  },
                                  last_name: {
                                    type: 'string'
                                  },
                                  phone: {
                                    type: 'string'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update user profile',
              tags: ['User']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-reviews-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/reviews': {
            get: {
              description: 'Returns paginated reviews for a specific product',
              parameters: [
                {
                  description: 'Product ID',
                  in: 'query',
                  name: 'product_id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Items per page',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    type: 'integer'
                  }
                },
                {
                  description: 'Offset',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  limit: {
                                    type: 'integer'
                                  },
                                  offset: {
                                    type: 'integer'
                                  },
                                  reviews: {
                                    items: {
                                      $ref: '#/components/schemas/dto.ReviewResponse'
                                    },
                                    type: 'array'
                                  },
                                  total: {
                                    type: 'integer'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              summary: 'Get product reviews',
              tags: ['Reviews']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ReviewResponse': {
              properties: {
                author: {
                  type: 'string'
                },
                comment: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_verified: {
                  type: 'boolean'
                },
                product_id: {
                  type: 'integer'
                },
                rating: {
                  type: 'integer'
                },
                title: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-reviews-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/reviews': {
            post: {
              description: 'Leave a rating and comment for a product',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateReviewRequest'
                    }
                  }
                },
                description: 'Review data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.Review'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create product review',
              tags: ['Reviews']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateReviewRequest': {
              properties: {
                comment: {
                  type: 'string'
                },
                product_id: {
                  type: 'integer'
                },
                rating: {
                  maximum: 5,
                  minimum: 1,
                  type: 'integer'
                },
                title: {
                  type: 'string'
                }
              },
              required: ['product_id', 'rating'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Review': {
              properties: {
                comment: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                is_verified: {
                  type: 'boolean'
                },
                product_id: {
                  type: 'integer'
                },
                rating: {
                  maximum: 5,
                  minimum: 1,
                  type: 'integer'
                },
                title: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-reviews-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/reviews/{id}': {
            delete: {
              description: 'Remove a review by ID',
              parameters: [
                {
                  description: 'Review ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete a review',
              tags: ['Reviews']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-reviews-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/reviews/{id}': {
            put: {
              description: 'Modify rating or comment of an existing review',
              parameters: [
                {
                  description: 'Review ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateReviewRequest'
                    }
                  }
                },
                description: 'Updated review data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.Review'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update a review',
              tags: ['Reviews']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateReviewRequest': {
              properties: {
                comment: {
                  type: 'string'
                },
                rating: {
                  maximum: 5,
                  minimum: 1,
                  type: 'integer'
                },
                title: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Review': {
              properties: {
                comment: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                id: {
                  type: 'integer'
                },
                is_verified: {
                  type: 'boolean'
                },
                product_id: {
                  type: 'integer'
                },
                rating: {
                  maximum: 5,
                  minimum: 1,
                  type: 'integer'
                },
                title: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-search-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/search': {
            get: {
              description: 'Search products, stores, and categories with advanced filters',
              parameters: [
                {
                  description: 'Search query (optional for filter-only browse)',
                  in: 'query',
                  name: 'q',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Items per page (default 10, max 50)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Offset for pagination',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Filter by category ID',
                  in: 'query',
                  name: 'category_id',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Filter by category slug',
                  in: 'query',
                  name: 'category_slug',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by store ID',
                  in: 'query',
                  name: 'store_id',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Minimum price',
                  in: 'query',
                  name: 'min_price',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Maximum price',
                  in: 'query',
                  name: 'max_price',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Minimum rating',
                  in: 'query',
                  name: 'min_rating',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Digital products only',
                  in: 'query',
                  name: 'is_digital',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'New arrivals only',
                  in: 'query',
                  name: 'is_new',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'In-stock products only',
                  in: 'query',
                  name: 'in_stock',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'On-sale products only',
                  in: 'query',
                  name: 'on_sale',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'Sort order (price_asc,price_desc,rating_desc,newest,popular)',
                  in: 'query',
                  name: 'sort',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.SearchResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                }
              },
              summary: 'Global search',
              tags: ['Search']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.SearchResponse': {
              properties: {
                categories: {
                  items: {
                    $ref: '#/components/schemas/dto.CategoryResponse'
                  },
                  type: 'array'
                },
                products: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductResponse'
                  },
                  type: 'array'
                },
                stores: {
                  items: {
                    $ref: '#/components/schemas/dto.StoreResponse'
                  },
                  type: 'array'
                },
                total: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.ProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.StoreResponse': {
              properties: {
                banner_url: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/dto.CategoryResponse'
                  },
                  type: 'array'
                },
                description: {
                  type: 'string'
                },
                follower_count: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                is_followed: {
                  type: 'boolean'
                },
                is_verified: {
                  type: 'boolean'
                },
                joined_at: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                return_policy: {
                  type: 'string'
                },
                review_count: {
                  type: 'integer'
                },
                shipping_info: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-search-suggestions-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/search/suggestions': {
            get: {
              description: 'Get autocomplete suggestions (products, stores, categories)',
              parameters: [
                {
                  description: 'Partial query',
                  in: 'query',
                  name: 'q',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Max suggestions (default 8, max 20)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.SuggestionsResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                }
              },
              summary: 'Search suggestions',
              tags: ['Search']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.SuggestionsResponse': {
              properties: {
                suggestions: {
                  items: {
                    $ref: '#/components/schemas/dto.SuggestionItem'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.SuggestionItem': {
              properties: {
                id: {
                  type: 'integer'
                },
                image: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                slug: {
                  type: 'string'
                },
                type: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-search-trending-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/search/trending': {
            get: {
              description: 'Get most popular search queries from the last 7 days',
              parameters: [
                {
                  description: 'Number of trending terms (default 10, max 20)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.TrendingResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              summary: 'Trending searches',
              tags: ['Search']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.TrendingResponse': {
              properties: {
                trending: {
                  items: {
                    $ref: '#/components/schemas/dto.TrendingSearch'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.TrendingSearch': {
              properties: {
                count: {
                  type: 'integer'
                },
                query: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-settings-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/settings': {
            get: {
              description: 'Returns a list of all settings with their keys and values.',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.SettingResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Settings list'
                }
              },
              summary: 'List all settings',
              tags: ['settings']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.SettingResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                key: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                value: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-settings-{key}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/settings/{key}': {
            delete: {
              description: 'Deletes a setting by its key. Admin only.',
              parameters: [
                {
                  description: 'Setting key',
                  in: 'path',
                  name: 'key',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Setting deleted'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Setting not found'
                }
              },
              summary: 'Delete a setting',
              tags: ['settings']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-settings-{key}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/settings/{key}': {
            get: {
              description: 'Returns the value (any JSON) for the given setting key.',
              parameters: [
                {
                  description: 'Setting key',
                  in: 'path',
                  name: 'key',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.SettingResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Setting found'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Setting not found'
                }
              },
              summary: 'Get a setting by key',
              tags: ['settings']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.SettingResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                key: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                value: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-settings-{key}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/settings/{key}': {
            put: {
              description:
                'Upserts a setting by key. If the key exists, value is updated; otherwise created.',
              parameters: [
                {
                  description: 'Setting key',
                  in: 'path',
                  name: 'key',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.SetSettingRequest'
                    }
                  }
                },
                description: 'Setting payload',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.SettingResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Setting updated'
                },
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.SettingResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Setting created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Validation error'
                }
              },
              summary: 'Create or update a setting',
              tags: ['settings']
            }
          }
        },
        components: {
          schemas: {
            'dto.SetSettingRequest': {
              properties: {
                description: {
                  type: 'string'
                },
                value: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                }
              },
              required: ['value'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.SettingResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                key: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                value: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-shipments-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/shipments': {
            get: {
              description: 'Returns all shipments belonging to an order (user must own the order).',
              parameters: [
                {
                  description: 'Order ID',
                  in: 'query',
                  name: 'order_id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/models.Shipment'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get shipments for an order',
              tags: ['Shipments']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Shipment': {
              properties: {
                address_line1: {
                  description: 'Shipping address',
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                carrier: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                delivered_at: {
                  type: 'string'
                },
                estimated_delivery: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                postal_code: {
                  type: 'string'
                },
                provider: {
                  $ref: '#/components/schemas/models.ShippingProviders'
                },
                provider_id: {
                  type: 'integer'
                },
                shipped_at: {
                  type: 'string'
                },
                shipping_price: {
                  type: 'number'
                },
                state: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                tracking_number: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-shipments-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/shipments/{id}': {
            get: {
              description:
                'Returns a shipment. Admin can see any; users see only shipments belonging to their orders.',
              parameters: [
                {
                  description: 'Shipment ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.Shipment'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get shipment by ID',
              tags: ['Shipments']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.Shipment': {
              properties: {
                address_line1: {
                  description: 'Shipping address',
                  type: 'string'
                },
                address_line2: {
                  type: 'string'
                },
                carrier: {
                  type: 'string'
                },
                city: {
                  type: 'string'
                },
                country: {
                  type: 'string'
                },
                created_at: {
                  type: 'string'
                },
                deleted_at: {
                  $ref: '#/components/schemas/gorm.DeletedAt'
                },
                delivered_at: {
                  type: 'string'
                },
                estimated_delivery: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                order_id: {
                  type: 'integer'
                },
                postal_code: {
                  type: 'string'
                },
                provider: {
                  $ref: '#/components/schemas/models.ShippingProviders'
                },
                provider_id: {
                  type: 'integer'
                },
                shipped_at: {
                  type: 'string'
                },
                shipping_price: {
                  type: 'number'
                },
                state: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                tracking_number: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              type: 'object'
            },
            'gorm.DeletedAt': {
              properties: {
                time: {
                  type: 'string'
                },
                valid: {
                  description: 'Valid is true if Time is not NULL',
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-shipping-providers-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/shipping-providers': {
            get: {
              description: 'Returns all active shipping providers (public)',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/models.ShippingProviders'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                }
              },
              summary: 'Get active shipping providers',
              tags: ['Shipping']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-shipping-providers-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/shipping-providers': {
            post: {
              description: 'Adds a new shipping provider to the system',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateShippingProviderRequest'
                    }
                  }
                },
                description: 'Provider details',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.ShippingProviders'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                409: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Conflict'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'Create a new shipping provider',
              tags: ['Shipping Providers']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateShippingProviderRequest': {
              properties: {
                description: {
                  type: 'string'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  minimum: 0,
                  type: 'number'
                }
              },
              required: ['name'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-shipping-providers-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/shipping-providers/{id}': {
            delete: {
              description: 'Removes a shipping provider by its ID (admin only)',
              parameters: [
                {
                  description: 'Shipping provider ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              summary: 'Delete a shipping provider',
              tags: ['Shipping']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-shipping-providers-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/shipping-providers/{id}': {
            get: {
              description: 'Returns a single shipping provider',
              parameters: [
                {
                  description: 'Provider ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.ShippingProviders'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'Get a shipping provider by ID',
              tags: ['Shipping Providers']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-shipping-providers-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/shipping-providers/{id}': {
            put: {
              description: 'Updates fields of a shipping provider (partial update allowed)',
              parameters: [
                {
                  description: 'Provider ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateShippingProviderRequest'
                    }
                  }
                },
                description: 'Fields to update',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/models.ShippingProviders'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'Update an existing shipping provider',
              tags: ['Shipping Providers']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateShippingProviderRequest': {
              properties: {
                description: {
                  type: 'string'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  minimum: 0,
                  type: 'number'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'models.ShippingProviders': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-stores-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/stores': {
            get: {
              description: 'Get stores with pagination, search, location, rating, category filters',
              parameters: [
                {
                  description: 'Items per page (default 20, max 100)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    type: 'integer'
                  }
                },
                {
                  description: 'Number of items to skip',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    type: 'integer'
                  }
                },
                {
                  description: 'Search by name or description',
                  in: 'query',
                  name: 'search',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by location (partial match)',
                  in: 'query',
                  name: 'location',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Minimum rating (0-5)',
                  in: 'query',
                  name: 'min_rating',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Filter by category slug',
                  in: 'query',
                  name: 'category_slug',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Sort order (rating, followers, newest)',
                  in: 'query',
                  name: 'sort_by',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  limit: {
                                    type: 'integer'
                                  },
                                  offset: {
                                    type: 'integer'
                                  },
                                  stores: {
                                    items: {
                                      $ref: '#/components/schemas/dto.StoreResponse'
                                    },
                                    type: 'array'
                                  },
                                  total: {
                                    type: 'integer'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'List stores',
              tags: ['Stores']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.StoreResponse': {
              properties: {
                banner_url: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/dto.CategoryResponse'
                  },
                  type: 'array'
                },
                description: {
                  type: 'string'
                },
                follower_count: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                is_followed: {
                  type: 'boolean'
                },
                is_verified: {
                  type: 'boolean'
                },
                joined_at: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                return_policy: {
                  type: 'string'
                },
                review_count: {
                  type: 'integer'
                },
                shipping_info: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-stores-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/stores': {
            post: {
              description: 'Create a new store (admin only)',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.CreateStoreRequest'
                    }
                  }
                },
                description: 'Store details',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                201: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.StoreResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'Created'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Create store',
              tags: ['Stores']
            }
          }
        },
        components: {
          schemas: {
            'dto.CreateStoreRequest': {
              properties: {
                banner_url: {
                  type: 'string'
                },
                category_ids: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                description: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                return_policy: {
                  type: 'string'
                },
                shipping_info: {
                  type: 'string'
                },
                user_id: {
                  type: 'integer'
                }
              },
              required: ['name'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.StoreResponse': {
              properties: {
                banner_url: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/dto.CategoryResponse'
                  },
                  type: 'array'
                },
                description: {
                  type: 'string'
                },
                follower_count: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                is_followed: {
                  type: 'boolean'
                },
                is_verified: {
                  type: 'boolean'
                },
                joined_at: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                return_policy: {
                  type: 'string'
                },
                review_count: {
                  type: 'integer'
                },
                shipping_info: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-stores-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/stores/{id}': {
            delete: {
              description: 'Soft delete a store (admin only)',
              parameters: [
                {
                  description: 'Store ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete store',
              tags: ['Stores']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-stores-{id}-put.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/stores/{id}': {
            put: {
              description: 'Update store details (admin only)',
              parameters: [
                {
                  description: 'Store ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.UpdateStoreRequest'
                    }
                  }
                },
                description: 'Updated store data',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.StoreResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Update store',
              tags: ['Stores']
            }
          }
        },
        components: {
          schemas: {
            'dto.UpdateStoreRequest': {
              properties: {
                banner_url: {
                  type: 'string'
                },
                category_ids: {
                  items: {
                    type: 'integer'
                  },
                  type: 'array'
                },
                description: {
                  type: 'string'
                },
                is_verified: {
                  type: 'boolean'
                },
                location: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                return_policy: {
                  type: 'string'
                },
                shipping_info: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.StoreResponse': {
              properties: {
                banner_url: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/dto.CategoryResponse'
                  },
                  type: 'array'
                },
                description: {
                  type: 'string'
                },
                follower_count: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                is_followed: {
                  type: 'boolean'
                },
                is_verified: {
                  type: 'boolean'
                },
                joined_at: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                return_policy: {
                  type: 'string'
                },
                review_count: {
                  type: 'integer'
                },
                shipping_info: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-stores-{slug}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/stores/{slug}': {
            get: {
              description: 'Fetch store details including categories and stats',
              parameters: [
                {
                  description: 'Store slug',
                  in: 'path',
                  name: 'slug',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.StoreResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'Get store by slug',
              tags: ['Stores']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.StoreResponse': {
              properties: {
                banner_url: {
                  type: 'string'
                },
                categories: {
                  items: {
                    $ref: '#/components/schemas/dto.CategoryResponse'
                  },
                  type: 'array'
                },
                description: {
                  type: 'string'
                },
                follower_count: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                is_followed: {
                  type: 'boolean'
                },
                is_verified: {
                  type: 'boolean'
                },
                joined_at: {
                  type: 'string'
                },
                location: {
                  type: 'string'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                return_policy: {
                  type: 'string'
                },
                review_count: {
                  type: 'integer'
                },
                shipping_info: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-stores-{slug}-follow-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/stores/{slug}/follow': {
            delete: {
              description: 'Unfollow a store (authenticated)',
              parameters: [
                {
                  description: 'Store slug',
                  in: 'path',
                  name: 'slug',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Unfollow a store',
              tags: ['Stores']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-stores-{slug}-follow-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/stores/{slug}/follow': {
            post: {
              description: 'Follow a store (authenticated)',
              parameters: [
                {
                  description: 'Store slug',
                  in: 'path',
                  name: 'slug',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Follow a store',
              tags: ['Stores']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-stores-{slug}-products-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/stores/{slug}/products': {
            get: {
              description: 'List products belonging to a store with product filters & pagination',
              parameters: [
                {
                  description: 'Store slug',
                  in: 'path',
                  name: 'slug',
                  required: true,
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Items per page (default 20, max 100)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Number of items to skip',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Search by product name (partial match)',
                  in: 'query',
                  name: 'name',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Filter by category ID',
                  in: 'query',
                  name: 'category_id',
                  schema: {
                    type: 'integer'
                  }
                },
                {
                  description: 'Minimum price',
                  in: 'query',
                  name: 'min_price',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Maximum price',
                  in: 'query',
                  name: 'max_price',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Minimum rating',
                  in: 'query',
                  name: 'min_rating',
                  schema: {
                    type: 'number'
                  }
                },
                {
                  description: 'Digital products only',
                  in: 'query',
                  name: 'is_digital',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'New arrivals only',
                  in: 'query',
                  name: 'is_new',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'Sort order (price_asc,price_desc,rating_desc,newest)',
                  in: 'query',
                  name: 'sort',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  limit: {
                                    type: 'integer'
                                  },
                                  offset: {
                                    type: 'integer'
                                  },
                                  products: {
                                    items: {
                                      $ref: '#/components/schemas/dto.ProductResponse'
                                    },
                                    type: 'array'
                                  },
                                  total: {
                                    type: 'integer'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              summary: 'Get products of a store',
              tags: ['Stores']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.ProductResponse': {
              properties: {
                allow_backorder: {
                  type: 'boolean'
                },
                attributes: {
                  items: {
                    $ref: '#/components/schemas/dto.ProductAttributeResponse'
                  },
                  type: 'array'
                },
                barcode: {
                  type: 'string'
                },
                brand: {
                  $ref: '#/components/schemas/dto.BrandResponse'
                },
                brand_id: {
                  type: 'integer'
                },
                category: {
                  $ref: '#/components/schemas/dto.CategoryResponse'
                },
                category_id: {
                  type: 'integer'
                },
                channels: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                colors: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                compare_at_price: {
                  type: 'number'
                },
                cost: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                images: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                is_digital: {
                  type: 'boolean'
                },
                is_new: {
                  type: 'boolean'
                },
                low_stock_threshold: {
                  type: 'integer'
                },
                meta_description: {
                  type: 'string'
                },
                meta_title: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                price: {
                  type: 'number'
                },
                published_at: {
                  type: 'string'
                },
                rating: {
                  type: 'number'
                },
                reviews_count: {
                  type: 'integer'
                },
                sizes: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                sku: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                stock: {
                  type: 'integer'
                },
                tags: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                },
                track_inventory: {
                  type: 'boolean'
                },
                updated_at: {
                  type: 'string'
                },
                visibility: {
                  description: 'Publishing extras',
                  type: 'string'
                },
                warehouse_location: {
                  type: 'string'
                },
                weight: {
                  type: 'number'
                }
              },
              type: 'object'
            },
            'dto.ProductAttributeResponse': {
              properties: {
                name: {
                  type: 'string'
                },
                values: {
                  items: {
                    type: 'string'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.BrandResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                logo_url: {
                  type: 'string'
                },
                name: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.CategoryResponse': {
              properties: {
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                is_active: {
                  type: 'boolean'
                },
                level: {
                  type: 'integer'
                },
                name: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                path: {
                  type: 'string'
                },
                slug: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-user-menu-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/user/menu': {
            get: {
              description:
                "Returns the sidebar menu filtered by user's role and optional search term",
              parameters: [
                {
                  description: 'Search by label or href',
                  in: 'query',
                  name: 'search',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.SidebarGroup'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get user sidebar menu',
              tags: ['User Menu']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.SidebarGroup': {
              properties: {
                group: {
                  type: 'string'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/dto.SidebarItem'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.SidebarItem': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/dto.SidebarItem'
                  },
                  type: 'array'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                label: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-user-menu-structure-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/user/menu/structure': {
            get: {
              description:
                "Returns all menu groups and their items, nested and ordered, filtered by user's permissions.",
              parameters: [
                {
                  description: 'Search by label or href',
                  in: 'query',
                  name: 'search',
                  schema: {
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                items: {
                                  $ref: '#/components/schemas/dto.MenuGroupResponse'
                                },
                                type: 'array'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get user menu structure (grouped + nested)',
              tags: ['User Menu']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.MenuGroupResponse': {
              properties: {
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                id: {
                  type: 'integer'
                },
                items: {
                  items: {
                    $ref: '#/components/schemas/dto.MenuItemResponse'
                  },
                  type: 'array'
                },
                name: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            },
            'dto.MenuItemResponse': {
              properties: {
                children: {
                  items: {
                    $ref: '#/components/schemas/dto.MenuItemResponse'
                  },
                  type: 'array'
                },
                created_at: {
                  type: 'string'
                },
                display_order: {
                  type: 'integer'
                },
                group_id: {
                  type: 'integer'
                },
                href: {
                  type: 'string'
                },
                icon: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                label: {
                  type: 'string'
                },
                parent_id: {
                  type: 'integer'
                },
                permission: {
                  type: 'string'
                },
                updated_at: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-users-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/users': {
            get: {
              description: 'Returns a paginated list of all users. Supports advanced filtering.',
              parameters: [
                {
                  description: 'Items per page',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    maximum: 100,
                    minimum: 1,
                    type: 'integer'
                  }
                },
                {
                  description: 'Offset (skip number of items)',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    minimum: 0,
                    type: 'integer'
                  }
                },
                {
                  description: 'Filter by active status',
                  in: 'query',
                  name: 'is_active',
                  schema: {
                    type: 'boolean'
                  }
                },
                {
                  description: 'Partial match on email',
                  in: 'query',
                  name: 'email',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Partial match on phone',
                  in: 'query',
                  name: 'phone',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Partial match on first name',
                  in: 'query',
                  name: 'first_name',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Partial match on last name',
                  in: 'query',
                  name: 'last_name',
                  schema: {
                    type: 'string'
                  }
                },
                {
                  description: 'Exact match on role',
                  in: 'query',
                  name: 'role',
                  schema: {
                    enum: ['user', 'admin', 'moderator'],
                    type: 'string'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  limit: {
                                    type: 'integer'
                                  },
                                  offset: {
                                    type: 'integer'
                                  },
                                  total: {
                                    format: 'int64',
                                    type: 'integer'
                                  },
                                  users: {
                                    items: {
                                      properties: {
                                        created_at: {
                                          type: 'string'
                                        },
                                        email: {
                                          type: 'string'
                                        },
                                        first_name: {
                                          type: 'string'
                                        },
                                        id: {
                                          type: 'integer'
                                        },
                                        is_active: {
                                          type: 'boolean'
                                        },
                                        last_name: {
                                          type: 'string'
                                        },
                                        phone: {
                                          type: 'string'
                                        },
                                        role: {
                                          type: 'string'
                                        }
                                      },
                                      type: 'object'
                                    },
                                    type: 'array'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get all users',
              tags: ['User']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-users-me-liked-products-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/users/me/liked-products': {
            get: {
              description: 'Returns a list of product IDs that the authenticated user has liked.',
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  product_ids: {
                                    items: {
                                      type: 'integer'
                                    },
                                    type: 'array'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: "Get user's liked product IDs",
              tags: ['Product Likes']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-users-{id}-delete.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/users/{id}': {
            delete: {
              description:
                'Soft‑deletes a user by ID. Only accessible by users with the "admin" role.',
              parameters: [
                {
                  description: 'User ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                403: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Forbidden'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Delete a user',
              tags: ['User']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-wallet-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/wallet': {
            get: {
              description:
                'Returns the balance and paginated transaction history of the authenticated user.',
              parameters: [
                {
                  description: 'Items per page (default 20, max 100)',
                  in: 'query',
                  name: 'limit',
                  schema: {
                    default: 20,
                    type: 'integer'
                  }
                },
                {
                  description: 'Offset',
                  in: 'query',
                  name: 'offset',
                  schema: {
                    default: 0,
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.WalletDetailResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get wallet details',
              tags: ['Wallet']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.WalletDetailResponse': {
              properties: {
                balance: {
                  type: 'number'
                },
                currency: {
                  type: 'string'
                },
                limit: {
                  type: 'integer'
                },
                offset: {
                  type: 'integer'
                },
                total: {
                  type: 'integer'
                },
                transactions: {
                  items: {
                    $ref: '#/components/schemas/dto.TransactionResponse'
                  },
                  type: 'array'
                }
              },
              type: 'object'
            },
            'dto.TransactionResponse': {
              properties: {
                amount: {
                  type: 'number'
                },
                balance_after: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                reference_id: {
                  type: 'integer'
                },
                reference_type: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                type: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-wallet-deposit-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/wallet/deposit': {
            post: {
              description:
                'Create a pending deposit transaction. In production, this would integrate with a payment gateway.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.DepositRequest'
                    }
                  }
                },
                description: 'Deposit amount',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  transaction_id: {
                                    type: 'integer'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Deposit funds',
              tags: ['Wallet']
            }
          }
        },
        components: {
          schemas: {
            'dto.DepositRequest': {
              properties: {
                amount: {
                  type: 'number'
                },
                payment_method: {
                  description: 'for future gateway integration',
                  type: 'string'
                }
              },
              required: ['amount'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-wallet-deposit-{id}-cancel-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/wallet/deposit/{id}/cancel': {
            post: {
              description: 'Cancels a deposit that is still in pending status.',
              parameters: [
                {
                  description: 'Transaction ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Cancel pending deposit',
              tags: ['Wallet']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-wallet-transactions-{id}-get.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/wallet/transactions/{id}': {
            get: {
              description: 'Fetch details of a specific wallet transaction.',
              parameters: [
                {
                  description: 'Transaction ID',
                  in: 'path',
                  name: 'id',
                  required: true,
                  schema: {
                    type: 'integer'
                  }
                }
              ],
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                $ref: '#/components/schemas/dto.TransactionResponse'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                404: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Not Found'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Get transaction details',
              tags: ['Wallet']
            }
          }
        },
        components: {
          schemas: {
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            },
            'dto.TransactionResponse': {
              properties: {
                amount: {
                  type: 'number'
                },
                balance_after: {
                  type: 'number'
                },
                created_at: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                id: {
                  type: 'integer'
                },
                reference_id: {
                  type: 'integer'
                },
                reference_type: {
                  type: 'string'
                },
                status: {
                  type: 'string'
                },
                type: {
                  type: 'string'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  },
  {
    output: {
      target:
        '/Users/alirezaakbarzadeh/workshop/github.com/alireza-akbarzadeh/src/luxe-front/src/services/-wallet-withdraw-post.ts',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      prettier: true,
      override: {
        mutator: {
          path: '../lib/api/api-client.ts',
          name: 'customInstance'
        }
      }
    },
    input: {
      target: {
        openapi: '3.0.3',
        info: {
          contact: {
            email: 'support@luxe.com',
            name: 'API Support'
          },
          description: 'Production-grade e-commerce backend',
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          },
          termsOfService: 'http://swagger.io/terms/',
          title: 'Shopping Platform API',
          version: '1.0'
        },
        servers: [
          {
            url: 'https://localhost:8080/api/v1'
          }
        ],
        paths: {
          '/wallet/withdraw': {
            post: {
              description:
                'Withdraw money from wallet. In production, this would require admin approval or integration with payout gateway.',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/dto.WithdrawRequest'
                    }
                  }
                },
                description: 'Withdrawal amount',
                required: true,
                'x-originalParamName': 'request'
              },
              responses: {
                200: {
                  content: {
                    'application/json': {
                      schema: {
                        allOf: [
                          {
                            $ref: '#/components/schemas/utils.Response'
                          },
                          {
                            properties: {
                              data: {
                                properties: {
                                  transaction_id: {
                                    type: 'integer'
                                  }
                                },
                                type: 'object'
                              }
                            },
                            type: 'object'
                          }
                        ]
                      }
                    }
                  },
                  description: 'OK'
                },
                400: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Bad Request'
                },
                401: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Unauthorized'
                },
                500: {
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/utils.Response'
                      }
                    }
                  },
                  description: 'Internal Server Error'
                }
              },
              security: [
                {
                  BearerAuth: []
                }
              ],
              summary: 'Withdraw funds',
              tags: ['Wallet']
            }
          }
        },
        components: {
          schemas: {
            'dto.WithdrawRequest': {
              properties: {
                amount: {
                  type: 'number'
                },
                description: {
                  type: 'string'
                }
              },
              required: ['amount'],
              type: 'object'
            },
            'utils.Response': {
              properties: {
                code: {
                  type: 'integer'
                },
                error: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                success: {
                  type: 'boolean'
                }
              },
              type: 'object'
            }
          }
        }
      }
    }
  }
];
