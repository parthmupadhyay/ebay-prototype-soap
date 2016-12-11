package com.ebay;
import javax.jws.WebService;
import java.sql.*;

import org.json.JSONArray;
import org.json.JSONObject;

@WebService
public class Cart 
{
	String dbUrl = "jdbc:mysql://localhost:3306/ebaydb";
	public boolean addToCart(String cartItem)
	{
		System.out.println("add to cart");
		
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("insert into " +
			"cart(product_id,user_id,product_name,quantity,price,seller_id) " +
			"values(?,?,?,?,?,?);");
			JSONObject data= new JSONObject(cartItem);
			System.out.println(data);
			stmt.setInt(1,data.getInt("productId"));
			stmt.setInt(2, data.getInt("userId"));
			stmt.setString(3, data.getString("productName"));
			stmt.setInt(4, data.getInt("quantity"));
			stmt.setInt(5, data.getInt("price"));
			stmt.setInt(6, data.getInt("sellerId"));
			int rs=stmt.executeUpdate();
			
			if(rs==1)
				return true;
			
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return false;
	}
	
	
	public String loadCart(String userId)
	{
		JSONArray result=new JSONArray();
		System.out.println("in load cart");
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select c.cart_id,c.user_id,c.product_id,c.quantity,c.price,c.product_name,p.quantity as prodQuantity,u.username from ebaydb.cart c,ebaydb.products p,ebaydb.users u where c.product_id=p.product_id and p.seller_id=u.userid and c.user_id=?");
			stmt.setString(1,userId);
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
			e.printStackTrace();
			return "{'StatusCode'=401,'err'="+e.getMessage()+"}";
		}
		System.out.println(result.toString());
		return result.toString();
	}
	
	public boolean removeFromCart(String cartId)
	{
		boolean result=false;
		try
		{
		
			System.out.println("in removeFromCart");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("delete from cart where cart_id=?;");
			stmt.setInt(1,Integer.parseInt(cartId));
			int rs=stmt.executeUpdate();
			if(rs==1)
			{
				System.out.println("Removed item with cartId:"+cartId+" from cart");
				result=true;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return result;
	}

	public boolean updateCartItem(String cartId,int quantity)
	{
		boolean result=false;
		try
		{
			System.out.println("In updateCartItem");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("update cart set quantity =? where cart_id=?;");
			stmt.setInt(1,quantity);
			stmt.setInt(2,Integer.parseInt(cartId));
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
	
	public boolean emptyCart(String userId)
	{
		boolean result=false;
		try
		{
		
			System.out.println("in removeFromCart");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("delete from cart where user_id=?;");
			stmt.setInt(1,Integer.parseInt(userId));
			int rs=stmt.executeUpdate();
			if(rs==1)
			{
				System.out.println("Emptied cart for userId:"+userId);
				result=true;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return result;
	}
}
