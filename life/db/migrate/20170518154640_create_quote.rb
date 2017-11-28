class CreateQuote < ActiveRecord::Migration[5.1]
  def change
    create_table :quotes do |t|
      t.timestamps
      t.string :content
      t.string :author
    end
  end
end
