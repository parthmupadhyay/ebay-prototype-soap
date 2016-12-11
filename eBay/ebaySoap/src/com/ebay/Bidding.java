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
public class Bidding 
{
	String dbUrl = "jdbc:mysql://localhost:3306/ebaydb";
	public boolean insertBidProduct(String data)
	{
		boolean result=false;
		System.out.println("in insert bidProduct");
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("insert into bidproduct(product_id,bidStartTime,bidEndTime,highestBid,isBidEnded) values(?,?,?,?,0)");
			JSONObject dataObj=new JSONObject(data);
			stmt.setInt(1, dataObj.getInt("productId"));
			stmt.setString(2, dataObj.getString("bidStartTime"));
			stmt.setString(3,dataObj.getString("bidEndTime"));
			stmt.setInt(4, dataObj.getInt("highestBid"));
			stmt.setBoolean(5, dataObj.getBoolean("isBidEnded"));
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
	
	public String getRunningBidProducts()
	{
		JSONArray result=new JSONArray();
		try
		{
			System.out.println("In get bid products");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select * from bidProduct where isBidEnded=0");
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

	public boolean closeBid(int bidId)
	{
		boolean result=false;
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("update bidProduct set isBidEnded=1 where bid_id=?");
			stmt.setInt(1, bidId);
			
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

	public boolean updateQuantity(int productId)
	{
		boolean result=false;
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("update products set quantity=0 where product_id=?");
			stmt.setInt(1, productId);
			
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

	public String getBidDetail(int bidId)
	{
		JSONArray result=new JSONArray();
		try
		{
			System.out.println("In get bid detail");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select * from ebaydb.bid_detail where bid_id=? having max(bid_amount)");
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
	
	public String addOrder(int userId,int total,String orderDate)
	{
		JSONObject result=new JSONObject();
		System.out.println("in addOrder");
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("insert into ebaydb.order(user_id,total,order_date) values(?,?,?);",Statement.RETURN_GENERATED_KEYS);
			stmt.setInt(1, userId);
			stmt.setInt(2, total);
			stmt.setString(3,orderDate);
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

}
