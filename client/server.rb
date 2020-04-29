require 'webrick'

op = { BindAddress:  "127.0.0.1", Port: 3001, DocumentRoot: "." }

s = WEBrick::HTTPServer.new(op)

s.start
