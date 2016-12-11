package com.ebay;

import javax.jws.WebService;
import java.sql.*;
import org.json.JSONException;
import org.json.JSONObject;

@WebService
public class Login 
{
	String dbUrl = "jdbc:mysql://localhost:3306/ebaydb";
	public String login(String username,String password)
	{
		JSONObject result=new JSONObject();
		System.out.println("in login");
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("Select * FROM ebaydb.users where username=? and password=?");
			stmt.setString(1,username);
			stmt.setString(2, password);
			ResultSet rs=stmt.executeQuery();
			System.out.println(username);
			System.out.println(password);
			if(rs.next())
			{
				result.accumulate("statusCode", 200);
				result.accumulate("userid", rs.getInt("userid"));
				result.accumulate("lastloggin", rs.getString("lastloggin"));
			}
			else
			{
				result.accumulate("statusCode", 401);
			}
		}
		catch(SQLException | ClassNotFoundException e)
		{
			System.out.println(e);
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		System.out.println(result.toString());
		return result.toString();
	}
}
