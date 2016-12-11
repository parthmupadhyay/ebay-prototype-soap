package com.ebay;

import javax.jws.WebService;
import java.sql.*;

import org.json.JSONArray;

import org.json.JSONObject;

@WebService
public class SignUp 
{
	String dbUrl = "jdbc:mysql://localhost:3306/ebaydb";
	public boolean register(String userData)
	{
		boolean flag=false;
		System.out.println("in register");
		
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("insert into users(username,firstname,lastname,password,contactno,address,birthdate,email,lastloggin) values(?,?,?,?,?,?,?,?,?);");
			JSONObject data= new JSONObject(userData);
			System.out.println(data);
			stmt.setString(1, data.getString("username"));
			stmt.setString(2, data.getString("firstName"));
			stmt.setString(3, data.getString("lastName"));
			stmt.setString(4, data.getString("password"));
			stmt.setLong(5, data.getLong("contactNo"));
			stmt.setString(6, data.getString("address"));
			stmt.setString(7, data.getString("birthdate"));
			stmt.setString(8, data.getString("email"));
			stmt.setString(9, data.getString("lastloggin"));
			int result=stmt.executeUpdate();
			if(result==1)
			{
				flag=true;
			}
				
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return flag;
	}
	
	public boolean checkUserName(String username)
	{
		boolean result=false;
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select 1 as result FROM ebaydb.users where username=?");
			stmt.setString(1,username);
			ResultSet rs=stmt.executeQuery();
			if(rs.next())
				result=true;
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
		}
		return result;
	}
	
	public boolean checkEmail(String email)
	{
		boolean result=false;
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select 1 as result FROM ebaydb.users where email=?");
			stmt.setString(1,email);
			ResultSet rs=stmt.executeQuery();
			if(rs.next())
				result=true;
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			
		}
		return result;
	}
}
