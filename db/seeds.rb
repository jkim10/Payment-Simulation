# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'csv'
csv_text =  File.read(Rails.root.join('db', 'routing_numbers.csv'))
csv = CSV.parse(csv_text, encoding: "utf-8", liberal_parsing: true)
csv.each do |row|
  r = RoutingNumber.new
  r.routing_number = row[1]
  r.name = row[2]
  r.save
end

puts "There are now #{RoutingNumber.count} rows in the transactions table"
