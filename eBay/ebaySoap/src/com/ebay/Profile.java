package com.ebay;

import javax.jws.WebService;
import java.sql.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebService
public class Profile 
{	
	String dbUrl = "jdbc:mysql://localhost:3306/ebaydb";
	public String loadProfile(String username)
	{
		
		System.out.println("in load profile");
		JSONArray resArray=new JSONArray();
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("Select * FROM ebaydb.users where username=?");
			stmt.setString(1,username);
			ResultSet rs=stmt.executeQuery();
			ResultSetMetaData rsmd=rs.getMetaData();
			JSONObject result= new JSONObject();
			if(rs.next())
			{
			for(int i=0;i<rsmd.getColumnCount();i++)
				result.accumulate(rsmd.getColumnName(i+1),rs.getObject(i+1));	
			
			resArray.put(result);
			}
			else
			{
				System.out.println("empty result");
				resArray.put("");
			}
			
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		System.out.println(resArray.toString());
		return resArray.toString();
	}
	
}
