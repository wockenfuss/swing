require 'spec_helper'

describe "Geography" do

  class DummyClass
    attr_accessor :city, :city_ip
    def initialize
      @city_ip = Geocoder.search("63.77.247.10")
      @city = Geocoder.search("Detroit")
    end
  end

  before(:each) do
    @dummy = DummyClass.new
    @dummy.extend Geography
  end

  describe ".city_from_ip" do
    it "returns a city corresponding to an ip address" do
      Geocoder.stub(:search).and_return(@dummy.city_ip)
      name = Geography.city_from_ip("63.77.247.10")
      name.should eq "Detroit MI"
    end

    it "returns a default location if no city is found" do
      @dummy.city_ip = []
      Geocoder.stub(:search).and_return(@dummy.city_ip)
      name = Geography.city_from_ip("63.77.247.10")
      name.should eq "San Francisco CA"      
    end
  end

  describe ".city_from_city" do
    it "returns a city and state from an input city name" do
      Geocoder.stub(:search).and_return(@dummy.city)
      name = Geography.city_from_city("Detroit")
      name.should eq "Detroit MI"
    end

    it "returns nil if no matching city is found" do
      Geocoder.stub(:search).and_return([nil])
      name = Geography.city_from_city("Detroit")
      name.should be_nil
    end

  end
end