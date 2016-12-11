package com.ebay;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;

import javax.jws.WebService;

import org.json.JSONArray;
import org.json.JSONObject;

@WebService
public class Advertisement 
{
	String dbUrl = "jdbc:mysql://localhost:3306/ebaydb";
	public String addAdvertise(String data)
	{
		JSONObject result=new JSONObject();
		System.out.println("in addAdvertise");
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("insert into products(product_name,seller_id,description,quantity,price,isBidProduct) values(?,?,?,?,?,?);",Statement.RETURN_GENERATED_KEYS);
			JSONObject dataObj=new JSONObject(data);
			stmt.setString(1, dataObj.getString("productName"));
			stmt.setInt(2, dataObj.getInt("sellerId"));
			stmt.setString(3,dataObj.getString("description"));
			stmt.setInt(4, dataObj.getInt("quantity"));
			stmt.setInt(5, dataObj.getInt("price"));
			stmt.setBoolean(6, dataObj.getBoolean("isBidProduct"));
			int rs=stmt.executeUpdate();
			if(rs==1)
			{
				ResultSet resultSet=stmt.getGeneratedKeys();
				if(resultSet.next())
				{
					result.accumulate("result", true);
					result.accumulate("insertedId", resultSet.getInt(1));
				}
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return result.toString();
	}

	public String getAdvertisements(int userId)
	{
		JSONArray result=new JSONArray();
		try
		{
			System.out.println("In load orders");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select * from products where seller_id=?");
			stmt.setInt(1,userId);
			ResultSet rs=stmt.executeQuery();
			ResultSetMetaData rsmd= rs.getMetaData();
			while(rs.next())
			{
				JSONObject row=new JSONObject();
				for(int i=0;i<rsmd.getColumnCount();i++)
				{
					
					row.put(rsmd.getColumnName(i+1), rs.getObject(i+1));
				}
				result.put(row);
			}
		}
		catch(Exception e)
		{
			System.out.println(e);
			
			return "{'StatusCode'=401,'err'="+e.getMessage()+"}";
		}
		System.out.println(result.toString());
		return result.toString();
	}
}
