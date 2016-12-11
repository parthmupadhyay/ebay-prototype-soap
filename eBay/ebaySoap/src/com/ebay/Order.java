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
public class Order 
{
	String dbUrl = "jdbc:mysql://localhost:3306/ebaydb";
	
	public String addOrderEntry(int userId,int total,String date)
	{
		System.out.println("in addOrderEntry");
		JSONObject result=new JSONObject();
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("insert into ebaydb.order(user_id,total,order_date) values(?,?,?);",Statement.RETURN_GENERATED_KEYS);
			stmt.setInt(1, userId);
			stmt.setInt(2, total);
			stmt.setString(3,date);
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
		System.out.println(result.toString());
		return result.toString();
	}
	
	public boolean addOrderDetails(String data)
	{
		boolean result=false;
		System.out.println("in addOrderDetails");
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("insert into ebaydb.order_detail" +
		            "(order_id,product_id,product_name,quantity,price) values(?,?,?,?,?)");
			JSONObject dataObj=new JSONObject(data);
			stmt.setInt(1, dataObj.getInt("OrderId"));
			stmt.setInt(2, dataObj.getInt("productId"));
			stmt.setString(3,dataObj.getString("productName"));
			stmt.setInt(4, dataObj.getInt("quantity"));
			stmt.setInt(5, dataObj.getInt("price"));
			int rs=stmt.executeUpdate();
			if(rs==1)
			{
				result=true;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return result;
	}

	public boolean updateSellers(int quantity,int productId)
	{
		boolean result=false;
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("update products set quantity=quantity-? where product_id=?;");
			stmt.setInt(1, quantity);
			stmt.setInt(2, productId);
			int rs=stmt.executeUpdate();
			if(rs==1)
			{
				result=true;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return result;
	}
	
	public String loadOrders(String userId)
	{
		JSONArray result=new JSONArray();
		try
		{
			System.out.println("In load orders");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select order_id,order_date from ebaydb.order where user_id=? order by order_date desc;");
			stmt.setInt(1,Integer.parseInt(userId));
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
	
	public String loadOrderDetails(int orderId)
	{
		JSONArray result=new JSONArray();
		try
		{
			System.out.println("In load orders");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select od.order_id,od.product_name,od.price,od.quantity,o.order_date from ebaydb.order_detail od,ebaydb.order o where od.order_id=? and o.order_id=od.order_id;");
			stmt.setInt(1,orderId);
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
